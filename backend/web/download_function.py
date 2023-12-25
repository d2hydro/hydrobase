# -*- coding: utf-8 -*-
"""
Created on Mon Nov 22 20:43:46 2021

@author: danie
"""

import rasterio
from rasterio import merge

from pydantic import BaseModel
from typing import List
import geopandas as gpd
from shapely.geometry import box, LineString
from sqlalchemy import create_engine
import io
import zipfile
import uuid
from pathlib import Path

try:
    from .config import  POSTGIS, TEMP_DIR, AHN5_DIR, CRS
except ImportError:
    from config import POSTGIS, TEMP_DIR, AHN5_DIR, CRS

ahn_dir = AHN5_DIR
dtm_index_gdf = gpd.read_file(ahn_dir / 'dtm' / 'index.shp')
layer = "dtm"
temp_dir = Path(TEMP_DIR)

server = POSTGIS["server"]
port = POSTGIS["port"]
db = "ugw"
user = POSTGIS["user"]
password = POSTGIS["password"]

engine = create_engine(f'postgresql://{user}:{password}@{server}:{port}/{db}')

def _merge_rasters(indices, layer):
    with rasterio.open(ahn_dir.joinpath(layer, f"{indices[0].upper()}_CM.tif")) as src:
        profile = src.profile

    raster_data, affine = merge.merge([
        rasterio.open(ahn_dir.joinpath(layer, f"{i.upper()}_CM.tif")) for i in indices
        ])
    profile["transform"] = affine
    profile["width"] = raster_data.shape[2]
    profile["height"] = raster_data.shape[1]
    tif_file = temp_dir / f"{str(uuid.uuid4())}.tif"
    with rasterio.open(tif_file, 'w', **profile) as dst:
        dst.write(raster_data[0], 1)
        dst.scales = (0.01,)

    return tif_file
    

def download_bbox(bbox):
    poly_bounds = box(*bbox)
    bounds = tuple(bbox)
    # open zipfile
    s = io.BytesIO()
    zf = zipfile.ZipFile(s, "w")

    # read polygon data to GeoPackage
    gpkg_file = temp_dir / f"{str(uuid.uuid4())}.gpkg"

    # add original boundary to geopackage
    gpd.GeoDataFrame({"geometry": [LineString(poly_bounds.exterior)]},
                     crs=CRS).to_file(filename=gpkg_file,
                                      layer="download_extent",
                                      driver="GPKG")

    # get water level areas intersecting original bounds
    cmd = f"SELECT geom FROM waterlevel_areas WHERE waterlevel_areas.geom && ST_MakeEnvelope{bounds}"
    gdf = gpd.GeoDataFrame.from_postgis(cmd, engine)

    # re-compute bounds for downloading other sources
    if not gdf.empty:
        bounds = tuple(gdf.total_bounds)
        poly_bounds = box(*bounds)
        
        # add water level areas intersecting original bounds
        cmd = f"SELECT vp, zp, wp, geom FROM waterlevel_areas WHERE waterlevel_areas.geom && ST_MakeEnvelope{bounds}"
        gdf = gpd.GeoDataFrame.from_postgis(cmd, engine)

        for target in ["zp", "wp"]:
            gdf.loc[gdf[target].isna(), target] = gdf.loc[
                gdf[target].isna()
                ]["vp"]
        gdf.to_file(filename=gpkg_file, layer="waterlevel_areas", driver="GPKG")

    # add original boundary to geopackage
    gpd.GeoDataFrame({"geometry": [LineString(poly_bounds.exterior)]},
                     crs=CRS).to_file(filename=gpkg_file,
                                      layer="model_extent",
                                      driver="GPKG")

    # add water areas
    cmd = f"SELECT bl, bb, geom FROM water_areas WHERE water_areas.geom && ST_MakeEnvelope{bounds}"
    gdf = gpd.GeoDataFrame.from_postgis(cmd, engine)
    if not gdf.empty:
        gdf.to_file(filename=gpkg_file, layer="water_areas", driver="GPKG")

    # add water lines
    cmd = f"SELECT blu, bld, geom FROM water_lines WHERE water_lines.geom && ST_MakeEnvelope{bounds}"
    gdf = gpd.GeoDataFrame.from_postgis(cmd, engine)
    if not gdf.empty:
        gdf.to_file(filename=gpkg_file, layer="water_lines", driver="GPKG")

    zf.write(gpkg_file, "water_features.gpkg")
    
    if gpkg_file.exists():
        gpkg_file.unlink()
  
    # read raster data
    indices = dtm_index_gdf.loc[dtm_index_gdf.intersects(poly_bounds)]['bladnr'].to_list()
    if len(indices) > 1:
        tif_file = _merge_rasters(indices, layer)
    else:
        tif_file = ahn_dir.joinpath(layer, f"{indices[0].upper()}_CM.tif")

    zf.write(tif_file, f"{layer}.tif")

    if len(indices) > 1:
        if tif_file.exists():
            tif_file.unlink()

    zf.close()

    return s
