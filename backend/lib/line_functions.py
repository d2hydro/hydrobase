"""Functions to sample data along line."""

from shapely.geometry import LineString, Polygon
import geopandas as gpd
import pandas as pd
import rasterio
import math
import numpy as np

from config import DATA_DIR, SAMPLE_DIST

__title__ = 'Functions to sample data along line.'
__version__ = '0.0.1'

pd.options.mode.chained_assignment = None
ahn_dir = DATA_DIR.joinpath("ahn")
index_gdf = gpd.read_file(ahn_dir.joinpath("index.shp"))


def _data_to_line(data):
    return LineString([data[0:2], data[2:]])


def _bounds_to_poly(bounds):
    return Polygon([[bounds.left, bounds.top],
                   [bounds.right, bounds.top],
                   [bounds.right, bounds.bottom],
                   [bounds.left, bounds.bottom],
                   [bounds.left, bounds.top]])


def ahn(data):
    """Return AHN samples from data along line.

    Parameters
    ----------
    data: line of floats with start and end coordinates: [xmin, ymin, xmax, ymax]

    Result
    ------
    List of floats with distance and elevation values. Distance is measured from start
    coordinate: [[0, value1], [distance2, value2], [distance3, value3], [.., ..]]
    """
    line = _data_to_line(data)

    nbr_points = math.ceil(line.length / SAMPLE_DIST)

    # create sample points
    samples_gdf = gpd.GeoDataFrame(data={'geometry': [
        line.interpolate(i/float(nbr_points - 1),
                         normalized=True) for i in range(nbr_points)]})

    samples_gdf["distance"] = samples_gdf.apply((lambda x: x["geometry"].distance(
        samples_gdf.loc[0]["geometry"])), axis=1)

    indices = index_gdf.loc[index_gdf.intersects(line)]['bladnr'].to_list()

    for index in indices:
        tif_file = ahn_dir.joinpath(f"{index.upper()}_CM.tif")
        with rasterio.open(tif_file) as src:
            no_data = src.profile["nodata"]
            scale = src.scales[0]
            bounds_poly = _bounds_to_poly(src.bounds)
            samples_select_gdf = samples_gdf.loc[samples_gdf.within(bounds_poly)]
            xy = samples_select_gdf.apply((lambda x: list(x["geometry"].coords)[0]),
                                          axis=1).to_list()

            samples_select_gdf.loc[:, "value"] = [val[0] for val in src.sample(xy)]
            samples_select_gdf.loc[
                samples_select_gdf["value"] == no_data, "value"] = np.nan

            samples_gdf.loc[
                samples_select_gdf.index, "value"] = samples_select_gdf["value"]

    samples_gdf.dropna(subset=["value"], inplace=True)
    samples_gdf["eq_prev_val"] = samples_gdf["value"].eq(samples_gdf["value"].shift())
    samples_gdf["eq_next_val"] = samples_gdf[
        "value"].eq(samples_gdf["value"].shift(-1))

    samples_gdf.loc[(samples_gdf["eq_prev_val"]) & (samples_gdf[
        "eq_next_val"]), "value"] = np.nan

    samples_gdf.dropna(subset=["value"], inplace=True)
    samples_gdf["value"] = samples_gdf["value"] * scale

    return samples_gdf.apply((lambda x: [round(x["distance"], 2),
                                         round(x["value"], 2)]), axis=1).to_list()


def __test_ahn():
    data = [127552.871, 462627.39, 127748.203, 462290.405]
    gpd.GeoDataFrame({'geometry': [_data_to_line(data)]}).to_file('line.shp')
    start = pd.Timestamp.now()
    result = ahn(data)
    delta = pd.Timestamp.now() - start
    delta = delta.seconds + delta.microseconds / 1000000
    print(f"finished in {delta} seconds")
    return result
