# %%
from pathlib import Path
import ribasim

DATA_DIR = Path(r"d:\data")

model = ribasim.Model.read(DATA_DIR.joinpath("lhm", "lhm.toml"))

# %%
