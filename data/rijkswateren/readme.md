# Model voor de Rijkswateren

Laatst bijgewerkt: 30-11-2023

Let op (!) dit model rekent niet, waarschijnlijk i.v.m. A(h) tabellen

**Verbeteringen t.o.v. vorige vesie:**
- Verbeterd opknippen KRW
- Netwerk alleen op basis van OSM en (veel minder) edits
- A(h) relaties op basis van RWS bathymetrie

**Netwerk:**
- Basins op basis van opgeknipte KRW-lichamen
- Netwerk op basis van OSM edits

**Parameters:**
- A(H) tabellen op basis sampling bathymetrie rasters
- Basins verbonden met default resistance-knopen (resistance = 1000)

**Randvoorwaarden:**
- Basin/static: 5mm/dag neerslag, 1mm/dag verdamping
- FlowBoundary: 2750m3/s @ Lobith, 400 m3/s @ Eisden
- LevelBoundary: 0m NAP @ all nodes