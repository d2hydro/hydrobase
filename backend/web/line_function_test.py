import pytest

from .line_function import _ahn


def test_ahn():
    data = [127552.871, 462627.39, 127748.203, 462290.405]
    result = _ahn(data)
    assert type(result) == list
