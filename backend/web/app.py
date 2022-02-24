"""Äpp of HydroBase API."""
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
import zipfile


import json

try:
    from .config import STATIC, DATA, __title__, __version__
    from .line_function import sample_profile
    from .download_function import download_bbox
except ImportError:
    from config import STATIC, DATA, __title__, __version__
    from line_function import sample_profile
    from download_function import download_bbox

app = FastAPI(
    title=__title__,
    version=__version__
)

origins = [
    "*hydrobase.nl",
    "http://localhost:3000",
    "https://hydrobase.nl"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class LineData(BaseModel):
    """
    Model of line data JSON object, to be posted by request.

    Example:
    -------
    {
        "line": [127552.871, 462627.39, 127748.203, 462290.405],
        "max_samples": 2000
    }
    """

    line: List[float]
    max_samples: int = 2000
    layers: List[str]

    class Config:
        schema_extra = {
            "example": {
                "line": [127552.871, 462627.39, 127748.203, 462290.405],
                "max_samples": 2000,
                "layers": ["distance",
                           "digital_surface_model",
                           "digital_terrain_model",
                           "target_waterlevel_winter",
                           "target_waterlevel_summer",
                           "canal_cross_sections"]
                }
            }

class BoxData(BaseModel):
    """
    Model of line data JSON object, to be posted by request.

    Parameters:
    ----------
    bbox: list with download coordinates [xmin, ymin, xmax ymax]

    Example:
    -------
    {
        "bbox": [126005.6, 463307.6, 127005.6, 464307.6]
    }
    """

    bbox: List[float]

    class Config:
        schema_extra = {
            "example": {
                "bbox": [126005.6, 463307.6, 127005.6, 464307.6],
                }
            }


@app.get("/")
async def home():
    """Fetch the API home."""
    return FileResponse(STATIC / 'index.html')

@app.post('/download')
async def download(data: BoxData):
    """Download data within a box supplied in a JSON body."""

    s = download_bbox(data.bbox)
    response = StreamingResponse(iter([s.getvalue()]),
                                 media_type="application/x-zip-compressed",
                                 headers={
        "Content-Disposition": "attachment;filename=hydrobase_download.zip"
    })

    return response


@app.post('/profile')
async def profile(data: LineData):
    """Sample data over a line supplied in a JSON body."""
    response = await sample_profile(data.line, data.layers, data.max_samples)
    return response
