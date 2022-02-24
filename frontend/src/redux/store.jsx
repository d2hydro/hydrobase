import { createStore } from 'redux';

export const backgroundMaps = {
    OSM: 'Openstreetmap',
    LUFO: 'Luchtfoto'
}

//hier creëren we een lijst met actions. Deze kun je vanuit je component aanroepen. We koppelen iedere action aan een function die onderstaand wordt gedefineerd.
const objectConstants = { SETBACKGROUNDMAP: 'setBackgroundMap', ADDMAPLAYER: 'addMapLayer', REMOVEMAPLAYER: 'removeMapLayer', SETDATA: 'setData', LOADDATA: 'loadData', SELECTMARKER: 'selectMarker', TOGGLEPANEL: 'togglePanel', TOGGLECONTEXTPANEL: 'toggleContextPanel', OPENCONTEXTPANEL: 'openContextPanel', CLEARSELECTEDMARKER: 'clearSelectedMarker', SETFEATURETYPE: 'setFeaturetype', SETPOINTDATA: 'setPointData', SETPOLYGONEXTENT: 'setPolygonExtent', CLOSECOLOFON: 'closeColofon', OPENCOLOFON: 'openColofon', OPENSOURCES: 'openSources', CLOSESOURCES: 'closeSources', OPENMANUAL: 'openManual', CLOSEMANUAL: 'closeManual', SETCHARTSELECTION: 'setChartSelection', SETMAPLAYERSELECTION: 'setMapLayerSelection' }

//hier defineren we wat iedere action aan argumenten ontvangt en wat hij teruggeeft
export let objectActions = {
    setBackgroundMap(mode) { return { type: objectConstants.SETBACKGROUNDMAP, mapMode: mode } },
    addMapLayer(mapLayer) { return { type: objectConstants.ADDMAPLAYER, mapLayer: mapLayer } },
    removeMapLayer(mapLayer) { return { type: objectConstants.REMOVEMAPLAYER, mapLayer: mapLayer } },
    setData(data) { return { type: objectConstants.SETDATA, data: data } },
    loadData(data) { return { type: objectConstants.LOADDATA, data: data } },
    selectMarker(marker) { return { type: objectConstants.SELECTMARKER, marker: marker } },
    togglePanel() { return { type: objectConstants.TOGGLEPANEL } },
    toggleContextPanel() { return { type: objectConstants.TOGGLECONTEXTPANEL } },
    openContextPanel() { return { type: objectConstants.OPENCONTEXTPANEL } },
    clearSelectedMarker() { return { type: objectConstants.CLEARSELECTEDMARKER } },
    setFeaturetype(feature) { return { type: objectConstants.SETFEATURETYPE, featureType: feature } },
    setPointData(data) { return { type: objectConstants.SETPOINTDATA, pointData: data } },
    setPolygonExtent(extent) { return { type: objectConstants.SETPOLYGONEXTENT, polygonExtent: extent } },
    openColofon() { return { type: objectConstants.OPENCOLOFON } },
    closeColofon() { return { type: objectConstants.CLOSECOLOFON } },
    openSources() { return { type: objectConstants.OPENSOURCES } },
    closeSources() { return { type: objectConstants.CLOSESOURCES } },
    openManual() { return { type: objectConstants.OPENMANUAL } },
    closeManual() { return { type: objectConstants.CLOSEMANUAL } },
    setChartSelection(chartSelection) { return { type: objectConstants.SETCHARTSELECTION, chartSelection: chartSelection } },
    setMapLayerSelection(mapLayerSelection) { return { type: objectConstants.SETMAPLAYERSELECTION, mapLayerSelection: mapLayerSelection } }
}

//onderstaande functies voeren de actie ook daadwerkelijk uit en leggen het resultaat vast in de store. Dit zijn de zogeheten 'reducers'
let objectData = function (state = { featureType: "polyline", objectList: [], filteredObjects: [], drawerState: false, popupState: false, backgroundMap: backgroundMaps.OSM, contextPanelOpen: false, pointData: {}, polygonExtent: [], displayColofon: false, displaySources: false, displayManual: false, chartSelection: { DEM: false, DTM: true, zomerpeil: true, winterpeil: true, profiel: true }, mapLayerSelection: { peilgebieden: false, watervlakken: false } }, action) {
    switch (action.type) {
        case objectConstants.SETBACKGROUNDMAP:
            if (action.mapMode === backgroundMaps.OSM) {
                state.backgroundMap = backgroundMaps.OSM;
            } else if (action.mapMode === backgroundMaps.LUFO) {
                state.backgroundMap = backgroundMaps.LUFO;
            }
            return { ...state }
        case objectConstants.REMOVEMAPLAYER:
            state.mapLayers = state.mapLayers || [];
            state.mapLayers.splice(state.mapLayers.indexOf(action.mapLayers), 1);
            state.mapLayers = [...state.mapLayers];
            return { ...state }
        case objectConstants.ADDMAPLAYER:
            state.mapLayers = state.mapLayers || [];
            state.mapLayers.push(action.mapLayer);
            state.mapLayers = [...state.mapLayers];
            return { ...state }
        case objectConstants.SETDATA:
            state.data = action.data;
            return { ...state };
        case objectConstants.LOADDATA:
            loadData();
        default:
            return state;
        case objectConstants.SELECTMARKER:
            state.selectedMarker = action.marker;
            return { ...state };
        case objectConstants.CLEARSELECTEDMARKER:
            state.selectedMarker = null;
            return { ...state };
        case objectConstants.TOGGLEPANEL:
            state.panelOpen = !state.panelOpen;
            return { ...state };
        case objectConstants.TOGGLECONTEXTPANEL:
            state.contextPanelOpen = !state.contextPanelOpen;
            return { ...state };
        case objectConstants.OPENCONTEXTPANEL:
            state.contextPanelOpen = true;
            return { ...state };
        case objectConstants.SETFEATURETYPE:
            state.featureType = action.featureType;
            state.selectedMarker = null;
            return { ...state };
        case objectConstants.SETPOINTDATA:
            state.pointData = action.pointData;
            return { ...state };
        case objectConstants.SETPOLYGONEXTENT:
            state.polygonExtent = action.polygonExtent;
            return { ...state }
        case objectConstants.OPENCOLOFON:
            state.displayColofon = true;
            return { ...state }
        case objectConstants.CLOSECOLOFON:
            state.displayColofon = false;
            return { ...state }
        case objectConstants.OPENSOURCES:
            state.displaySources = true;
            return { ...state }
        case objectConstants.CLOSESOURCES:
            state.displaySources = false;
            return { ...state }
        case objectConstants.OPENMANUAL:
            state.displayManual = true;
            return { ...state }
        case objectConstants.CLOSEMANUAL:
            state.displayManual = false;
            return { ...state }
        case objectConstants.SETCHARTSELECTION:
            state.chartSelection = action.chartSelection;
            return { ...state }
        case objectConstants.SETMAPLAYERSELECTION:
            state.mapLayerSelection = action.mapLayerSelection;
            return { ...state }
    }
}

function loadData() {

}

function readNodes(data) {
    let nodes = [];
    for (let item of Object.keys(data)) {
        let node = { value: item, label: item }
        let children = data[item]
        for (let child of Object.keys(children)) {
            let subnode = { value: child, label: child, ...children[child] }
            node.children = node.children || []
            node.children.push(subnode)
        }
        if (node.children)
            node.children.sort((a, b) => a.order > b.order)
        nodes.push(node)
    }
    return nodes;
}

//export let objectStore = createStore(objectData, initialObjects);
export let objectStore = createStore(objectData);
