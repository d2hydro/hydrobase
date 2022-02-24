import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from .app import app


@pytest.fixture
async def async_client():
    client = AsyncClient(app=app, base_url='http://test')
    yield client
    await client.aclose()


@pytest.mark.asyncio
async def test_home(async_client):
    response = await async_client.get('/')
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_surface(async_client):
    # incorrect data format will return code 422
    data = [127552.871, 462627.39, 127748.203, 462290.405]
    response = await async_client.post('/surface', json=data)
    assert response.status_code == 422

    # data must be in this JSON format
    data = {
        'line': [127552.871, 462627.39, 127748.203, 462290.405]
    }
    response = await async_client.post('/surface', json=data)
    assert response.status_code == 200
