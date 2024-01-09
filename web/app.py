# %%
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

# from .config import STATIC_DIR

STATIC_DIR = Path(r"d:\repositories\hydrobase\static")
APP_DATA_DIR = STATIC_DIR / "data"
TEMPLATES_DIR = STATIC_DIR / "templates"
GEOSERVER_URL = "http://localhost:8080/geoserver"

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
templates = Jinja2Templates(directory=TEMPLATES_DIR)

tags_metadata = [
    {
        "name": "Ribasim",
        "description": "RIBASIM LHM netwerk",
    }
]

example_basin = {
    "static": {
        "drainage": 0,
        "potential_evaporation": 0.000000011574,
        "precipitation": 0.00000005787,
        "infiltration": 0,
        "urban_runoff": 0,
    },
    "profile": {"area": [0.01, 1000.0], "level": [0.0, 1.0]},
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


@app.get("/", include_in_schema=False, tags=["Ribasim"])
async def home():
    """Fetch the API home."""
    template = env.get_template("index.html")
    html_content = template.render(title="Ribasim")
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/info", include_in_schema=False, tags=["Ribasim"])
async def info(node_id: int):
    """
    - **node_id**: Ribasim node_id
    """

    template = env.get_template("basin.html")
    html_content = template.render(node_id=node_id)
    return HTMLResponse(content=html_content, status_code=200)

    # return templates.TemplateResponse("basin.html", {"request": {"node_id": node_id}})


@app.get("/basin", tags=["Ribasim"])
async def node(node_id: int) -> dict:
    """
    - **node_id**: Ribasim node_id
    """
    return example_basin


@app.get(
    "/static/{file_path:path}", include_in_schema=False, response_class=HTMLResponse
)
async def file(file_path: str, response: Response):
    file_path = APP_DATA_DIR / file_path
    if file_path.is_file():
        content = file_path.read_bytes()
        return Response(content=content, media_type="image/png")
    else:
        raise HTTPException(status_code=404, detail="File not found")


@app.get("/geoserver/{path:path}", include_in_schema=False)
async def proxy_geoserver(path: str, request: Request):
    # Combine the path and query parameters to construct the full URL
    original_url = f"http://localhost:8080/geoserver/{path}?{request.url.query}"

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
