# %%
try:
    from .case_conversions import snake_to_pascal_case
except ImportError:
    from case_conversions import snake_to_pascal_case
from matplotlib.colors import rgb2hex
from matplotlib.cm import tab20
from itertools import cycle
import pandas as pd

colors = cycle(tab20.colors)


def get_zoom_level(node_id, df):
    authority = df.at[node_id, "meta_waterbeheerder"]
    if authority == "Rijkswaterstaat":
        return 0
    else:
        category = df.at[node_id, "meta_categorie"]
        if pd.isna(category):
            return 1
        else:
            if category == "hoofdwater":
                return 1
            else:
                return 2


# %%
def layers_for_geoserver(model):
    layers_gpkg = model.filepath.with_name("geoserver_layers.gpkg")

    def write_layers(df, attr, mask):
        # write storage version
        _df = df[mask]
        if not _df.empty:
            _df.to_file(layers_gpkg, layer=f"Storage{snake_to_pascal_case(attr)}")

        # write water version
        _df = df[~mask]
        if not _df.empty:
            _df.to_file(layers_gpkg, layer=f"Water{snake_to_pascal_case(attr)}")

    # remove if exists
    if layers_gpkg.exists():
        layers_gpkg.unlink()

    # split nodes on meta_category
    for attr in [
        "basin",
        "outlet",
        "tabulated_rating_curve",
        "pump",
        "user_demand",
        "manning_resistance",
        "linear_resistance",
    ]:
        df = getattr(model, attr).node.df
        if not df.empty:
            df.loc[df["meta_categorie"].isna(), "meta_categorie"] = "niet_bergend"
            mask = df["meta_categorie"] == "bergend"
            df.loc[~mask, "meta_zoom_level"] = df[~mask].apply(
                (lambda x: get_zoom_level(x.name, df)), axis=1
            )
            write_layers(df, attr, mask)

            if attr == "basin":
                df = model.basin.area.df
                mask = df.node_id.isin(mask[mask].index)
                df.loc[mask, "meta_color"] = [
                    rgb2hex(next(colors)) for _ in df[mask].index
                ]
                df.loc[mask, "meta_streefpeil"] = pd.Series(dtype=float)
                df.loc[~mask, "meta_zoom_level"] = df.loc[~mask, "node_id"].apply(
                    lambda x: get_zoom_level(x, model.basin.node.df)
                )
                model.basin.area.df.loc[
                    model.basin.area.df.meta_streefpeil == "<NA>", ["meta_streefpeil"]
                ] = None

                write_layers(df, attr="basin_area", mask=mask)

    # split edges on meta_category
    df = model.edge.df
    df.loc[df["meta_categorie"].isna(), "meta_categorie"] = "niet_bergend"
    mask = (df["meta_categorie"] == "bergend") | (df["edge_type"] != "flow")
    write_layers(df, attr="Edge", mask=mask)

    # write boundaries
    df = model.flow_boundary.node.df.reset_index()
    if not df.empty:
        df.loc[:, "meta_zoom_level"] = df.loc[:, "node_id"].apply(
            lambda x: get_zoom_level(x, model.flow_boundary.node.df)
        )
        df.to_file(layers_gpkg, layer="FlowBoundary")
    df = model.level_boundary.node.df.reset_index()
    if not df.empty:
        df.loc[:, "meta_zoom_level"] = df.loc[:, "node_id"].apply(
            lambda x: get_zoom_level(x, model.level_boundary.node.df)
        )
        df.to_file(layers_gpkg, layer="LevelBoundary")
    return layers_gpkg


# %%
