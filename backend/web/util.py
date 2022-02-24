from asyncio import get_event_loop
from functools import wraps, partial


def async_wrap(func):
    '''
    run long-running heavy jobs in event loop
    '''
    @wraps(func)
    async def run(*args, loop=None, executor=None, **kwargs):
        if loop is None:
            loop = get_event_loop()
        pfunc = partial(func, *args, **kwargs)
        return await loop.run_in_executor(executor, pfunc)
    return run
