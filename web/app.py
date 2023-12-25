#%%
"""LHM app for the Netherlands"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response, JSONResponse
from fastapi.staticfiles import StaticFiles
#from .utils import get_logger
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
#from .config import STATIC_DIR

STATIC_DIR = Path(r"d:\repositories\hydrobase\static") 
APP_DATA_DIR = STATIC_DIR / "data"
TEMPLATES_DIR = STATIC_DIR / "templates"

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

tags_metadata = [
    {
        "name": "Ribasim",
        "description": "RIBASIM LHM netwerk",
    }
]

app = FastAPI(
    title="Ribasim LHM",
    description='<a href="/">Home</a>',
    version="0.0.1",
    openapi_tags=tags_metadata
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

#logger = get_logger("DEBUG", "app.log")


@app.get("/", tags=["Ribasim"])
async def home():
    """Fetch the API home."""
    template = env.get_template("index.html")
    html_content = template.render(title="Ribasim")
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/static/{file_path:path}", response_class=HTMLResponse)
async def file(file_path: str, response: Response):
    file_path = APP_DATA_DIR / file_path
    if file_path.is_file():
        content = file_path.read_bytes()
        return Response(content=content, media_type="image/png")
    else:
        raise HTTPException(status_code=404, detail="File not found")

# %%
