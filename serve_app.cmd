call micromamba activate hydrobase

python -m uvicorn web:app --reload --host 127.0.0.1 --port 3000
