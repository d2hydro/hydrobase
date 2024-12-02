# %%
import geopandas as gpd

"""LHM app for the Netherlands"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import shapely

# from .utils import get_logger
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
from ribasim import Model
from shapely.geometry import Point
import json
import pandas as pd

try:
    from .config import DATA_DIR, GEOSERVER_URL, APP_URL
    from .utils import layers_for_geoserver
    from .case_conversions import pascal_to_snake_case
except ImportError:
    from config import DATA_DIR, GEOSERVER_URL, APP_URL
    from utils import layers_for_geoserver
    from case_conversions import pascal_to_snake_case


PARAMETER_MAP = {
    "drainage": {"unit": "m/s", "name": "Drainage"},
    "demand": {"unit": "m3/s", "name": "Watervraag"},
    "flow_rate": {"unit": "m3/s", "name": "Debiet"},
    "infiltration": {"unit": "m/s", "name": "Infiltratie"},
    "level": {"unit": "m[NAP]", "name": "Waterhoogte"},
    "max_flow_rate": {"unit": "m3/s", "name": "Maximaal debiet"},
    "max_downstream_level": {"unit": "m[NAP]", "name": "Waterhoogte beneden"},
    "min_flow_rate": {"unit": "m3/s", "name": "Minimaal debiet"},
    "min_level": {"unit": "m[NAP]", "name": "Minimale waterhoogte"},
    "min_upstream_level": {"unit": "m[NAP]", "name": "Waterhoogte boven"},
    "potential_evaporation": {"unit": "m/s", "name": "Verdamping"},
    "precipitation": {"unit": "m/s", "name": "Neerslag"},
    "priority": {"unit": "", "name": "Prioriteit"},
    "return_factor": {"unit": "", "name": "Retourfactor"},
}

STATIC_DIR = Path(__file__).parents[1] / "static"
APP_DATA_DIR = STATIC_DIR.joinpath("data")
TEMPLATES_DIR = STATIC_DIR.joinpath("templates")
BASE_ICON_URL = "static/icons/{icon_name}.ico"
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# %%
# data
structures_gdf = gpd.read_file(
    DATA_DIR.joinpath("hydamo", "hydamo.gpkg"),
    layer="kunstwerken",
    engine="pyogrio",
    fid_as_index=True,
)

ribasim_toml = DATA_DIR.joinpath("lhm", "lhm.toml")
model = Model.read(ribasim_toml)

node_table = model.node_table().df
layers_gpkg = layers_for_geoserver(model)


class Layers:
    water_basin_area = gpd.read_file(layers_gpkg, layer="WaterBasinArea").set_index(
        "node_id"
    )
    water_pump = gpd.read_file(layers_gpkg, layer="WaterPump").set_index("node_id")
    water_outlet = gpd.read_file(layers_gpkg, layer="WaterOutlet").set_index("node_id")
    water_tabulated_rating_curve = gpd.read_file(
        layers_gpkg, layer="WaterTabulatedRatingCurve"
    ).set_index("node_id")
    storage_basin_area = gpd.read_file(layers_gpkg, layer="StorageBasinArea").set_index(
        "node_id"
    )
    water_user_demand = gpd.read_file(layers_gpkg, layer="WaterUserDemand").set_index(
        "node_id"
    )

    _node_layers = [
        "water_pump",
        "water_tabulated_rating_curve",
        "water_outlet",
        "water_user_demand",
    ]
    _area_layers = ["water_basin_area", "storage_basin_area"]

    def get_layer(self, node_id: int):
        layers = (
            "water_pump",
            "water_outlet",
            "water_tabulated_rating_curve",
            "water_basin_area",
            "storage_basin_area",
            "water_user_demand",
        )
        return next(
            (layer for layer in layers if node_id in getattr(self, layer).index)
        )

    def get_icon(self, layer: str):
        if layer == "water_basin_area":
            return "watervlak.svg"
        elif layer == "storage_basin_area":
            return "gebied.svg"
        elif layer == "water_pump":
            return "gemaal.svg"
        elif layer == "water_outlet":
            return "constant.svg"
        elif layer == "water_tabulated_rating_curve":
            return "qh.svg"
        elif layer == "water_user_demand":
            return "gebruiker.svg"

    def _strip_layer_name(self, layer):
        return pascal_to_snake_case(layer.split(":")[1])

    def get_feature_by_point(self, point, tolerance, layers=[]):
        # construct node and area_df
        layers = [self._strip_layer_name(i) for i in layers]
        node_layers = [getattr(self, i) for i in layers if i in self._node_layers]
        if node_layers:
            node_df = pd.concat(node_layers)

        area_layers = [getattr(self, i) for i in layers if i in self._area_layers]
        if area_layers:
            area_df = pd.concat(area_layers)

        # if node_layers we see if we can find a node in tolerance
        if len(node_layers) > 0:
            node_distance = node_df.distance(point).sort_values()
            if (
                node_distance < tolerance
            ).any():  # if node within tolerance we return node
                node_id = node_distance.idxmin()
                return node_df.loc[[node_id]].reset_index()

        # if area_layers and we still haven't returned we see if point is contained by area
        if len(area_layers) > 0:
            area_df = area_df[area_df.contains(point)]
            if area_df.empty:
                return None
            else:
                if len(area_df) == 1:
                    node_id = area_df.index[0]
                else:
                    area_df.loc[:, ["area"]] = area_df.geometry.area
                    node_id = area_df["area"].sort_values().idxmin()

                df = pd.concat(
                    [
                        area_df.loc[[node_id]].reset_index(),
                        model.basin.node.df.loc[[node_id]].reset_index(),
                    ],
                    ignore_index=True,
                )
                df.loc[:, ["node_type"]] = "Basin"
                return df
        else:
            return None


app_layers = Layers()

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

origins = ["*"]


def static_to_dict(df):
    return [
        [PARAMETER_MAP[k]["name"], v, PARAMETER_MAP[k]["unit"]]
        for k, v in df.dropna().to_dict().items()
    ]


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
    data_layers = "ribasim:StorageBasinArea,ribasim:WaterBasinArea,ribasim:WaterEdge,ribasim:WaterPump,ribasim:WaterOutlet,ribasim:WaterTabulatedRatingCurve,ribasim:WaterUserDemand"
    query_layers = "ribasim:WaterBasinArea"
    html_content = template.render(
        title="Ribasim-NL",
        icon_url=icon_url,
        data_layers=data_layers,
        query_layers=query_layers,
        geoserver_url=GEOSERVER_URL,
        app_url=APP_URL,
    )
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/ribasim/manifest", include_in_schema=False, tags=["Ribasim"])
async def get_manifest():
    return manifest


@app.get("/node", include_in_schema=False, tags=["Ribasim"])
async def node(x: float, y: float, tolerance: float, layers: str):
    """
    - **x**: x-coordinate
    - **y**: y-coordinate
    - **tolerance**: tolerance around point for searching objects
    - **layers**: layers as a filter
    """
    point = Point(x, y)
    feature = app_layers.get_feature_by_point(
        point, tolerance, layers=layers.split(",")
    )
    if feature is None:
        return None
    else:
        feature.loc[:, ["geometry"]] = gpd.GeoSeries(
            shapely.set_precision(shapely.force_2d(feature.geometry.array), grid_size=1)
        )
        return json.loads(feature.to_json())


@app.get("/search", include_in_schema=False)
async def search(query: str):
    if len(query) > 1:
        return node_table[node_table.name.str.contains(f"(?i){query}")].name.to_list()
    else:
        return []


@app.get("/info", include_in_schema=False)
async def info(node_id=int):
    """
    - **x**: x-coordinate
    - **y**: y-coordinate
    - **tolerance**: tolerance around point for searching objects
    """

    node_id = int(node_id)
    if node_id is not None:
        layer = app_layers.get_layer(node_id)

        kwargs = dict(
            node_id=node_id,
            node_type=node_table.at[node_id, "node_type"],
            node_name=node_table.at[node_id, "name"],
            photo_url=f"{APP_URL}/static/icons/{app_layers.get_icon(layer)}",
        )

        # basins and rating curves are always graph-types
        if layer in [
            "water_basin_area",
            "storage_basin_area",
            "water_tabulated_rating_curve",
        ]:
            template = env.get_template("info_graph.html")

        # pumps and outlets can be graphs can be constant
        elif layer in ["water_pump", "water_outlet"]:
            flow_rate = (
                getattr(model, layer.split("_")[1])
                .static.df.set_index("node_id")
                .at[node_id, "flow_rate"]
            )
            if isinstance(flow_rate, pd.Series):
                template = env.get_template("info_graph.html")
            else:
                template = env.get_template("info_constant.html")
                kwargs["flow_rate"] = flow_rate
        else:
            template = env.get_template("info_constant.html")

        html_content = template.render(**kwargs)

        return HTMLResponse(content=html_content, status_code=200)
    else:
        return None


@app.get("/graph_data", tags=["Ribasim"])
async def graph_data(node_id: int):
    node_type = node_table.at[node_id, "node_type"]
    if node_type == "Basin":
        # select data
        profile_df = model.basin.profile.df[
            model.basin.profile.df["node_id"] == node_id
        ][["area", "level"]]

        graph_data = dict(
            title="A(h) profiel",
            x_axis_title="hoogte [m NAP]",
            y_axis_title="oppervlak [m2]",
            x=profile_df["level"].to_list(),
            y=profile_df["area"].to_list(),
        )

        return graph_data

    elif node_type == "TabulatedRatingCurve":
        curve_df = model.tabulated_rating_curve.static.df[
            model.tabulated_rating_curve.static.df["node_id"] == node_id
        ][["flow_rate", "level"]]

        graph_data = dict(
            title="Q(h) profiel",
            x_axis_title="hoogte [m NAP]",
            y_axis_title="debiet [m3/s]",
            x=curve_df["level"].to_list(),
            y=curve_df["flow_rate"].to_list(),
        )

        return graph_data


@app.get("/static_data", tags=["Ribasim"])
async def static_data(node_id: int):
    node_type = node_table.at[node_id, "node_type"]
    df = getattr(model, pascal_to_snake_case(node_type)).static.df
    df = df.set_index("node_id").loc[node_id]
    if isinstance(df, pd.Series):
        result = static_to_dict(df)
        if len(result) > 0:
            return result
        else:
            return None
    else:
        return None


@app.get("/outlet/control", tags=["Ribasim"])
async def outlet(node_id: int) -> dict | None:
    """
    - **node_id**: Ribasim node_id
    """

    # get table
    static_df = model.outlet.static.df[model.outlet.static.df["node_id"] == node_id]

    # check if outlet has control
    if len(static_df) > 1:
        # get controller
        mask = (model.edge.df.to_node_id == node_id) & (
            model.edge.df.edge_type == "control"
        )
        control_node_id = model.edge.df[mask].iloc[0].from_node_id

        condition_df = model.discrete_control.condition.df[
            model.discrete_control.condition.df["node_id"] == control_node_id
        ]

        control_df = pd.concat(
            [
                condition_df.set_index("meta_control_state"),
                static_df.set_index("control_state"),
            ],
            axis=1,
        )
        control_df = control_df[["greater_than", "flow_rate"]].rename(
            columns={"greater_than": "control_state"}
        )

        static = {"control": control_df[["flow_rate", "control_state"]].to_dict("list")}
        return static
    else:
        return None


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
