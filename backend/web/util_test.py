import time

import pytest

from .util import async_wrap


@async_wrap
def sleep(t: float):
    time.sleep(t)
    return True


@pytest.mark.asyncio
async def test_sleep():
    'Test time.sleep is converted to async correctly'
    result = await sleep(0.1)
    assert result
