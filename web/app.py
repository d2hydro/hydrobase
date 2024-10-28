# %%
import geopandas as gpd

"""LHM app for the Netherlands"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# from .utils import get_logger
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import httpx
import ribasim

# from .config import STATIC_DIR

STATIC_DIR = Path(r"d:\repositories\hydrobase\static")
APP_DATA_DIR = STATIC_DIR.joinpath("data")
TEMPLATES_DIR = STATIC_DIR.joinpath("templates")
GEOSERVER_URL = "https://www.hydrobase.nl/geoserver/geoserver"
BASE_ICON_URL = "static/icons/{icon_name}.ico"
DATA_DIR = Path(r"d:\data")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# data
structures_gdf = gpd.read_file(
    DATA_DIR.joinpath("hydamo", "hydamo.gpkg"),
    layer="kunstwerken",
    engine="pyogrio",
    fid_as_index=True,
)
model = ribasim.Model.read(DATA_DIR.joinpath("lhm", "lhm.toml"))


tags_metadata = [
    {
        "name": "Ribasim",
        "description": "RIBASIM LHM netwerk",
    },
    {
        "name": "HyDAMO",
        "description": "HyDAMO+ basisgegevens",
    },
]

manifest = {
    "name": "Ribasim-NL",
    "short_name": "Ribasim-NL",
    "description": "The LHM Ribasim-model on your desktop or modile device",
    "start_url": "/ribasim",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
        {"src": "/static/icons/ribasim.png", "sizes": "192x192", "type": "image/png"}
    ],
}
app = FastAPI(
    title="Ribasim LHM",
    description='<a href="/">Home</a>',
    version="0.0.1",
    openapi_tags=tags_metadata,
)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
async def home():
    """Fetch the API home."""
    template = env.get_template("root_page.html")
    html_content = template.render(title="Hydrobase")
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/ribasim", include_in_schema=False, tags=["Ribasim"])
async def ribasim_home():
    """Fetch the Ribasim home."""
    template = env.get_template("index.html")
    icon_url = BASE_ICON_URL.format(icon_name="ribasim")
    data_layers = "ribasim:BasinArea,ribasim:Edge,ribasim:Node"
    query_layers = "ribasim:Node"
    html_content = template.render(
        title="Ribasim-NL",
        icon_url=icon_url,
        data_layers=data_layers,
        query_layers=query_layers,
    )
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/hydamo", include_in_schema=False, tags=["HyDAMO"])
async def hydamo_home():
    """Fetch the HyDAMO home."""
    template = env.get_template("index.html")
    icon_url = BASE_ICON_URL.format(icon_name="hydamo_plus")
    data_layers = "hydamo:bathymetrie,hydamo:krw_waterlichamen,hydamo:hydroobject,hydamo:kunstwerk"
    query_layers = "hydamo:kunstwerk"
    html_content = template.render(
        title="HyDAMO+",
        icon_url=icon_url,
        data_layers=data_layers,
        query_layers=query_layers,
    )
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/ribasim/manifest", include_in_schema=False, tags=["Ribasim"])
async def get_manifest():
    return manifest


@app.get("/info", include_in_schema=False, tags=["Ribasim"])
async def info(layer: str, fid: int):
    """
    - **layer**: Hydrobase layer (str)
    - **fid: feature id witin layer (int)
    """

    photo_url = "https://www.hydrobase.nl/static/icons/photo_placeholder.png"
    if layer == "Node":
        node = model.network.node.df.loc[fid]
        if node["node_type"] == "Basin":
            template = env.get_template("basin.html")
            html_content = template.render(photo_url=photo_url, node_id=fid)
        else:
            html_content = "<br> <br> <br> <br> template for node not yet implemented"
    elif layer == "kunstwerk":
        structure = structures_gdf.loc[fid]
        template = env.get_template("structure.html")
        html_content = template.render(
            name=structure.naam,
            photo_url=structure.photo_url,
            code=structure.code,
            complex=structure.complex_naam,
            type=structure.kw_soort,
            source=structure.bron,
        )

    return HTMLResponse(content=html_content, status_code=200)


@app.get("/basin", tags=["Ribasim"])
async def node(node_id: int) -> dict:
    """
    - **node_id**: Ribasim node_id
    """
    profile = {
        "profile": model.basin.profile.df[model.basin.profile.df["node_id"] == node_id][
            ["area", "level"]
        ].to_dict("list")
    }
    return profile


@app.get(
    "/static/{file_path:path}", include_in_schema=False, response_class=HTMLResponse
)
async def file(file_path: str, response: Response):
    file_path = APP_DATA_DIR.joinpath(file_path)
    if file_path.is_file():
        content = file_path.read_bytes()
        return Response(content=content, media_type="image/png")
    else:
        raise HTTPException(status_code=404, detail="File not found")


@app.get("/geoserver/{path:path}", include_in_schema=False)
async def proxy_geoserver(path: str, request: Request):
    # Combine the path and query parameters to construct the full URL
    original_url = f"http://localhost:6001/geoserver/{path}?{request.url.query}"

    # Make a request to the GeoServer
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(original_url)
            response.raise_for_status()

            content_type = response.headers.get(
                "content-type", "application/octet-stream"
            )

            # Return the binary data directly
            return Response(content=response.content, media_type=content_type)
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail="Proxying error",
                headers=exc.response.headers,
            )


# %%
