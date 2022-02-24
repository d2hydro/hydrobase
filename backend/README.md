# HydroBase

## Installation

```
conda env create -f environment.yml
conda activate hydrobase
```

## Run server

Run the server using Uvicorn,

```
uvicorn web:app --reload --host 127.0.0.1 --port 7001
```

## Test API endpoints
Open in web-browser: [http://localhost:7001/docs](http://localhost:7001/docs)
