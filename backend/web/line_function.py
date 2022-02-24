'''Functions to sample data along line.'''

from typing import List, Literal
from sqlalchemy import create_engine
from shapely.geometry import LineString, MultiLineString, Point, box, Polygon
import geopandas as gpd
import pandas as pd
import rasterio
import math
import numpy as np
from operator import itemgetter

try:
    from .config import AHN_DIR, SAMPLE_DIST, POSTGIS
    from .util import async_wrap
except ImportError:
    from config import AHN_DIR, SAMPLE_DIST, POSTGIS
    from util import async_wrap


__title__ = 'Functions to sample data along line.'
__version__ = '0.0.1'  # version of AHN function, not related to app version

pd.options.mode.chained_assignment = None
ahn_dir = AHN_DIR
dtm_index_gdf = gpd.read_file(ahn_dir / 'dtm' / 'index.shp')
dummy_level = {"tl_summer": -1.5,
               "tl_winter": -2,
               "canal_xs": -2.5}

waterlevel_attributes = {"tl_summer": "zp",
                         "tl_winter": "wp"}

server = POSTGIS["server"]
port = POSTGIS["port"]
db = "ugw"
user = POSTGIS["user"]
password = POSTGIS["password"]

engine = create_engine(f'postgresql://{user}:{password}@{server}:{port}/{db}')

SAMPLE_DIST = 0.5

def _data_to_line(data: List[float]) -> LineString:
    return LineString([data[0:2], data[2:]])

def _data_to_multiline(data: List[float],
                       clip_layer: str = None,
                       clip_polygon: Polygon = None,
                       inverse: bool = False) -> MultiLineString:
    line = LineString([data[0:2], data[2:]])
    if clip_layer:
        cmd = f"SELECT geom FROM {clip_layer} WHERE {clip_layer}.geom && ST_MakeEnvelope{line.bounds}"
        clip_polygon = gpd.GeoDataFrame.from_postgis(cmd, engine).unary_union
    if clip_polygon is not None:
        if inverse:
            mask_polygon = box(*line.bounds)
            clip_polygon = mask_polygon.difference(clip_polygon)

        line = line.intersection(clip_polygon)
 
    if line.type == "LineString":
        line = MultiLineString([line])

    return line

def _get_bounds(data: List[float]) -> List[float]:
    line = _data_to_line(data)
    return line.bounds


def _get_wla(line):
    cmd = f"SELECT vp, zp, wp, geom FROM waterlevel_areas WHERE waterlevel_areas.geom && ST_MakeEnvelope{line.bounds}"
    gdf = gpd.GeoDataFrame.from_postgis(cmd, engine)
    gdf = gdf.loc[gdf.intersects(line)]
    for target in ["zp", "wp"]:
        gdf.loc[gdf[target].isna(), target] = gdf.loc[
            gdf[target].isna()
            ]["vp"]
    return gdf


def _get_wa(line):
    cmd = f"SELECT bl, bb, geom FROM water_areas WHERE water_areas.geom && ST_MakeEnvelope{line.bounds}"
    gdf = gpd.GeoDataFrame.from_postgis(cmd, engine)
    gdf = gdf.loc[gdf.intersects(line)]
    return gdf

def _sample_ahn(samples_gdf, line, layer):
    indices = dtm_index_gdf.loc[dtm_index_gdf.intersects(line)]['bladnr'].to_list()

    for index in indices:
        tif_file = ahn_dir.joinpath(layer, f"{index.upper()}_CM.tif")
        with rasterio.open(tif_file) as src:
            no_data = src.profile["nodata"]
            scale = src.scales[0]
            bounds_poly = box(*src.bounds)
            samples_select_gdf = samples_gdf.loc[samples_gdf.within(bounds_poly)]
            xy = samples_select_gdf.apply((lambda x: list(x["geometry"].coords)[0]),
                                          axis=1).to_list()

            samples_select_gdf.loc[:, "value"] = [val[0] for val in src.sample(xy)]
            samples_select_gdf.loc[
                samples_select_gdf["value"] == no_data, "value"] = np.nan

            samples_gdf.loc[
                samples_select_gdf.index, "value"] = samples_select_gdf["value"]
            
    samples_gdf.loc[:, "value"] = samples_gdf["value"] * scale

    return samples_gdf["value"]

def _xyz_line_from_ahn(line):
    samples_gdf = gpd.GeoDataFrame(data={"geometry": line.boundary})
    samples_gdf["value"] = _sample_ahn(samples_gdf, line, layer="dtm")
    default = samples_gdf["value"].min()

    return MultiLineString([
        _line_to_xyz(i,
                     samples_gdf,
                     idx,
                     default) for idx, i in enumerate(line)
        ])

def _line_to_xyz(line, samples_gdf, line_idx, default):
    z_left = samples_gdf.loc[line_idx * 2]["value"]
    z_right = samples_gdf.loc[line_idx * 2 + 1]["value"]
    if not np.all([np.isnan(z_left), np.isnan(z_right)]):
        if np.isnan(z_left):
            z_left = z_right
        elif np.isnan(z_right):
            z_right = z_left
    else:
        z_left = z_right = default

    line = LineString([(*line.coords[0], z_left), (*line.coords[1], z_right)]) 
    return line

def _sample_along_line(line: LineString,
                       sample_dist: float,
                       line_idx: int):
    nbr_points = max(math.ceil(line.length / sample_dist), 2)
    samples = [
        line.interpolate(i/float(nbr_points - 1),
                         normalized=True) for i in range(nbr_points)
        ]
    return gpd.GeoDataFrame(data={"line_idx":[line_idx]*len(samples),
                                  "geometry":samples})


def _samples_from_waterareas(line, wa_gdf):
    waterarea = wa_gdf.loc[wa_gdf.intersects(line)].copy()
    waterarea.loc[waterarea["bb"].isna(), "bb"] = line.length
    bottom_width = min(waterarea.iloc[0]["bb"], line.length)
    bottom_level = round(waterarea.iloc[0]["bl"], 2)
    
    centre_distance = line.length/2
    
    points = [line.boundary[0].centroid,
              line.interpolate(centre_distance - bottom_width/2).centroid,
              line.interpolate(centre_distance + bottom_width/2).centroid,
              line.boundary[1].centroid]
    
    values = [line.boundary[0].z,
              bottom_level,
              bottom_level,
              line.boundary[1].z]

    return gpd.GeoDataFrame({"canal_cross_sections":values,
                             "geometry":points})

def _sample_profile(data, layers, max_samples):
    """Function to sample data from a line."""   
    # all there is to get from the line-data
    start_point = Point(data[0:2])
    line = _data_to_line(data)
    
    # water-level area (wla) and water areas (wa) from PostGIS
    wla_gdf = _get_wla(line)
    wa_gdf = _get_wa(line)
    
    # different represenations of lins
    multi_line_wa = _xyz_line_from_ahn(
        _data_to_multiline(data, clip_layer="water_areas")
        )
    
    multi_line_ahn = _data_to_multiline(data,
                                        clip_layer="water_areas",
                                        inverse=True)
    
    # ahn sampling properties
    sample_dist = max(_data_to_multiline(data).length / max_samples, SAMPLE_DIST)
    
    
    
    # %% get AHN samples
    ahn_samples_gdf = pd.concat(
            [_sample_along_line(i,
                                sample_dist,
                                idx) for idx, i in enumerate(multi_line_ahn)],
                                ).reset_index()
    
    ahn_samples_gdf["distance"] = ahn_samples_gdf.apply(
        (lambda x: x["geometry"].distance(start_point)),
        axis=1
        )
    
    ahn_samples_gdf["digital_surface_model"] = _sample_ahn(ahn_samples_gdf, line, "dsm")
    ahn_samples_gdf["digital_terrain_model"] = _sample_ahn(ahn_samples_gdf, line, "dtm")
    ahn_samples_gdf.set_index("distance", inplace=True)
    
    # %% get cross section samples
    wa_samples_gdf = pd.concat(
        [_samples_from_waterareas(i, wa_gdf) for i in multi_line_wa],
        ignore_index=True
        )
    
    wa_samples_gdf["distance"] = wa_samples_gdf.apply(
        (lambda x: x["geometry"].distance(start_point)),
        axis=1
        )
    wa_samples_gdf.set_index("distance", inplace=True)
    
    
    # %% merge ahn and cross-sections
    samples_gdf = ahn_samples_gdf.merge(wa_samples_gdf, how="outer")
    
    samples_gdf["distance"] = samples_gdf.apply(
        (lambda x: x["geometry"].distance(start_point)),
        axis=1
        )
    
    samples_gdf.sort_values("distance", inplace=True)
    
    # %% get target-levels
    samples_gdf[["target_waterlevel_summer", "target_waterlevel_winter"]] = np.nan
    for _, row in wla_gdf.iterrows():
        samples_gdf.loc[
            samples_gdf.intersects(row["geom"]), ["target_waterlevel_summer"]
            ] = row["zp"]
        samples_gdf.loc[
            samples_gdf.intersects(row["geom"]), ["target_waterlevel_winter"]
            ] = row["wp"]
    
    # %% finish all to JSON
    samples_gdf.dropna(how="all", inplace=True)
    samples_gdf = samples_gdf[layers]
    samples_gdf = samples_gdf.round(2)
    samples_gdf.replace({np.nan: None}, inplace=True)
    samples_list = samples_gdf.T.reset_index().values.T.tolist()
    return samples_list


@async_wrap
def sample_profile(line: List[float], layers: List[str], max_samples: int = None):
    """Return list of ahn surface coordinates for line data."""
    response = _sample_profile(line, layers, max_samples)
    return response


'''
@async_wrap
def ahn_dsm(line: List[float], max_samples: int = None):
    """Return list of ahn surface coordinates for line data."""
    yz_list = _ahn(data=line, max_samples=max_samples, layer="dsm")
    return yz_list


@async_wrap
def canal_xs(line: List[float], max_samples: int = None):
    """Return list of ahn surface coordinates for line data."""
    yz_list = _crosssections(data=line)
    return yz_list


@async_wrap
def tl_summer(line: List[float], max_samples: int = None):
    """Return list of ahn surface coordinates for line data."""
    yz_list = _target_waterlevel(data=line, target="zp")
    return yz_list


@async_wrap
def tl_winter(line: List[float], max_samples: int = None):
    """Return list of ahn surface coordinates for line data."""
    yz_list = _target_waterlevel(data=line, target="wp")
    return yz_list
'''