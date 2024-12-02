# Hydrobase

Hydrobase is a [Ribasim](https://ribasim.org/) viewer developed by **[D2Hydro](https://d2hydro.nl/)**.
It runs at https://hydrobase.nl/ribasim.

## Workings

This app uses a [GeoServer](https://geoserver.org/) instance in the backend to serve a
GeoPackage based on the Ribasim model database.
The model must therefore be placed on the server, typically this will be the
Dutch national LHM model schematization from [Ribasim-NL](https://ribasim.nl/).
The `/web/app.py` defines several endpoints using [FastAPI](https://fastapi.tiangolo.com/)
to display more model data.

## Run locally

Running hydrobase locally is mainly meant for developers of the application.

1. Install [Pixi](https://pixi.sh/).
2. Install a Java (JRE) that is [compatible with GeoServer](https://docs.geoserver.org/main/en/user/production/java.html).
3. Install [GeoServer](https://docs.geoserver.org/main/en/user/installation/index.html), noting the GEOSERVER_DATA_DIR.
4. Copy the contents of the `geoserver` directory in this repository over the GEOSERVER_DATA_DIR.
5. Create a directory `d:\hydrobase_data\lhm\` and place the current version of the Ribasim LHM model there.
   This consists of two files, `lhm.toml` and `database.gpkg`. This directory is referenced in
   `geoserver/workspaces/ribasim/ribasim/datastore.xml`, as well as the `config.py` of the next step.
5. Create a file `/web/config.py` with these contents:
   ```
   from pathlib import Path
   GEOSERVER_URL = "http://localhost:8080"
   APP_URL = "http://localhost:3000"
   DATA_DIR = Path(r"d:/hydrobase_data")
   ```
   If you run GeoServer on a different port, change it here.
6. Run the app with `pixi run app` or equivalently run `/serve_app.cmd`.
   This will create a modified GeoPackage next to `database.gpkg` called `geoserver_layers.gpkg`
   with layers more suitable for visualization with the current GeoServer workspace.
7. Open the locally hosted app at http://localhost:3000.
