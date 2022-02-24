import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayerPanel from './LayerPanel';
import ContextPanel from './ContextPanel';
import { backgroundMaps, objectActions } from '../redux/store';
import * as gf from '../js/generalfunctions.js';
import endpoints from '../js/endpoints.js';

class Map extends Component {
    state = {
        mapExtentIsSet: false,
        map: null,
        rasterLayerGroup: null,
        objectsLayerGroup: null,
        controlsLayerGroup: null,
        points: [],                    //representing the points on the map. 1 in case of point, 2 in case of polyline, 4 in case of polygon
        markers: [],                   //representing the markers (latlng) on the map. 1 in case of point, 2 in case of polyline, 4 in case of polygon
        polylines: [],                 //representing the polylines on the map. 0 in case of point, 1 in case of polyline, 4 in case of polygon
        prevFeatureType: null,      //to track a toggle between point, polyline and polygon
        temppolyline1: null,        //the temporary polyline as drawin while mouseover
        temppolyline2: null,        //the secondary temporary polyline to close the rectangle while mouseover for point #4
        mymap: null,
        waterlayer: null
    }


    constructor() {
        super();
        this.plotLayers = this.plotLayers.bind(this);
        this.clearMapObjects = this.clearMapObjects.bind(this);
        this.addPeilgebieden = this.addPeilgebieden.bind(this);
    }


    componentDidMount() {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //MAP IN WGS84 COORDINATES
        let RD = new window.L.Proj.CRS(
            'EPSG:28992',
            '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', {
            origin: [-285401.92, 22598.08],
            resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105],
            bounds: window.L.bounds([-285401.92, 22598.08], [595401.920, 903401.920])
        });


        let osmlayer = window.L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png', {
                maxZoom: 25,
                attribution: '<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY</a> Kadaster '
            });

        this.waterlayer = window.L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:3857/{z}/{x}/{y}.png', {
        });

        this.mymap = new window.L.Map('map', {
            zoomControl: false,
            layers: [osmlayer],
        });    

        this.mymap.setView([52.1, 5.988751316], 8);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //MAP IN RD COORDS
        // let RD = new window.L.Proj.CRS(
        //     'EPSG:28992',
        //     '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', {
        //     origin: [-285401.92, 22598.08],
        //     resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105],
        //     bounds: window.L.bounds([-285401.92, 22598.08], [595401.920, 903401.920])
        // });

        // // let waterlayer = window.L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{z}/{x}/{y}.png', {
        // let waterlayer = window.L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{TileMatrix}/{TileCol}/{TileRow}.png', {
        //     // minZoom: 0,
        //     // maxZoom: 14
        // });

        // let mymap = new window.L.Map('map', {
        //     crs: RD,
        //     zoomControl: false,
        //     layers: [waterlayer]
        // });
        // let center = window.L.point(227596, 513591);
        // mymap.setView(RD.projection.unproject(center), 7);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        let rasterLayerGroup = window.L.layerGroup().addTo(this.mymap);
        let objectsLayerGroup = window.L.layerGroup().addTo(this.mymap);
        let controlsLayerGroup = window.L.layerGroup().addTo(this.mymap);

        this.mymap.on("mousemove", (e) => {
            //remove the previous temporary marker
            if (this.markerBtemp) {
                this.markerBtemp.remove();
                this.markerBtemp = null;
            }
            if (this.markerCtemp) {
                this.markerCtemp.remove();
                this.markerCtemp = null;
            }
            if (this.markerDtemp) {
                this.markerDtemp.remove();
                this.markerDtemp = null;
            }
            if (this.props.featureType === 'polyline') {
                if (this.state.markers.length === 1) {
                    //first point already exists. So draw the endpoint + polyline
                    let iconB = window.L.divIcon({ className: 'arrow-icon', bgPos: [0, 0], html: '<div id="arrow" style="transform: rotate(' + gf.getAngle(this.state.points[0], e.latlng, -1).toString() + 'deg)">▶</div>' });
                    this.markerBtemp = window.L.marker(e.latlng, {
                        icon: iconB
                    }).addTo(controlsLayerGroup);
                    this.drawTemporaryPolyLine(this.state.markers[0], this.markerBtemp, controlsLayerGroup, this.mymap);
                }
            } else if (this.props.featureType === 'polygon') {
                //what we need to draw here depends on which point we're currently drawing.
                if (this.state.markers.length === 1) {
                    //we're drawing the second point & the first line
                    let iconB = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.markerBtemp = window.L.marker(e.latlng, {
                        icon: iconB
                    }).addTo(controlsLayerGroup);
                    this.drawTemporaryPolyLine(this.state.markers[0], this.markerBtemp, controlsLayerGroup, this.mymap);
                } else if (this.state.markers.length === 2) {
                    let iconC = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.markerCtemp = window.L.marker(e.latlng, {
                        icon: iconC
                    }).addTo(controlsLayerGroup);
                    this.drawTemporaryPolyLine(this.state.markers[1], this.markerCtemp, controlsLayerGroup, this.mymap);
                } else if (this.state.markers.length === 3) {
                    let iconD = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.markerDtemp = window.L.marker(e.latlng, {
                        icon: iconD
                    }).addTo(controlsLayerGroup);
                    this.drawTemporaryPolyLine(this.state.markers[2], this.markerDtemp, controlsLayerGroup, this.mymap);
                    //this.drawTemporaryPolyLine(this.markerBtemp, this.state.markers[0], controlsLayerGroup, mymap);
                }
            }
        })

        this.mymap.on("click", async (e) => {
            if (this.props.featureType === 'point') {
                if (this.state.markers.length > 0) {
                    //remove the existing points, markers and polylines
                    this.state.markers[0].remove();
                    this.setState({ markers: [], points: [], polylines: [], temppolyline1: null, temppolyline2: null });                    
                }

                //create our point and place it on the map
                this.state.points.push(e.latlng);
                let iconA = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                this.state.markers.push(window.L.marker(e.latlng, {
                    icon: iconA
                }).addTo(controlsLayerGroup));

                let xy = gf.WGS842RD(e.latlng.lat, e.latlng.lng)
                let response = await fetch(endpoints.pointdata + "?service=WFS&version=2.0.0&request=GetFeature&typeName=UGW:waterlevel_areas&outputFormat=application/json&cql_filter=CONTAINS(geom,POINT(" + xy[0] + "%20" + xy[1] + "))");
                let data = await response.json();

                this.showPopup({ type: "POINT", start: e.latlng, end: e.latlng, ...this.state.polylines[0] });
                this.props.setPointData(data);

            } else if (this.props.featureType === 'polyline') {
                if (this.state.markers.length >= 2) {
                    //remove the existing points, markers and polylines
                    this.state.markers[1].remove();
                    this.state.markers[0].remove();
                    this.state.polylines[0].remove();
                    this.setState({ markers: [], points: [], polylines: [] }); 
                }

                if (this.state.markers.length === 1) {
                    //first point already exists so create the second marker + the line
                    this.state.points.push(e.latlng);
                    let iconB = window.L.divIcon({ className: 'arrow-icon', bgPos: [0, 0], html: '<div id="arrow" style="transform: rotate(' + gf.getAngle(this.state.points[0], this.state.points[1], -1).toString() + 'deg)">▶</div>' });
                    this.state.markers.push(window.L.marker(e.latlng, {
                        icon: iconB
                    }).addTo(controlsLayerGroup));
                    this.addPolyLine(this.state.markers[0], this.state.markers[1], controlsLayerGroup)                 
                } else {
                    //create the first point
                    this.state.points.push(e.latlng);
                    let iconA = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.state.markers.push(window.L.marker(e.latlng, {
                        icon: iconA
                    }).addTo(controlsLayerGroup));
                }
            } else if (this.props.featureType === 'polygon') {
                if (this.state.markers.length >= 4) {
                    //our map has a complete polygon, so remove it and start over
                    this.state.markers[3].remove();
                    this.state.markers[2].remove();
                    this.state.markers[1].remove();
                    this.state.markers[0].remove();
                    this.state.polylines[3].remove();
                    this.state.polylines[2].remove();
                    this.state.polylines[1].remove();
                    this.state.polylines[0].remove();
                    this.setState({ markers: [], points: [], polylines: [] });
                } else if (this.state.markers.length >= 3) {
                    //our polygon is nearly complete. It just needs one more point & polyline plus the closing line
                    this.state.points.push(e.latlng);
                    let iconD = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.state.markers.push(window.L.marker(e.latlng, {
                        icon: iconD
                    }).addTo(controlsLayerGroup));
                    this.addPolyLine(this.state.markers[2], this.state.markers[3], controlsLayerGroup)
                    this.addPolyLine(this.state.markers[3], this.state.markers[0], controlsLayerGroup)  //closing the polygon!
                } else if (this.state.markers.length >= 2) {
                    //let's draw the third point and second polyline
                    this.state.points.push(e.latlng);
                    let iconC = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.state.markers.push(window.L.marker(e.latlng, {
                        icon: iconC
                    }).addTo(controlsLayerGroup));
                    this.addPolyLine(this.state.markers[1], this.state.markers[2], controlsLayerGroup)
                } else if (this.state.markers.length >= 1) {
                    //let's draw the second point and the first polyline   
                    this.state.points.push(e.latlng);
                    let iconB = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.state.markers.push(window.L.marker(e.latlng, {
                        icon: iconB
                    }).addTo(controlsLayerGroup));
                    this.addPolyLine(this.state.markers[0], this.state.markers[1], controlsLayerGroup)
                } else if (this.state.markers.length === 0) {
                    //draw the first point!
                    this.state.points.push(e.latlng);
                    let iconA = window.L.divIcon({ className: 'my-div-icon', iconSize: 10 });
                    this.state.markers.push(window.L.marker(e.latlng, {
                        icon: iconA
                    }).addTo(controlsLayerGroup));
                }
            }

        })

        this.setState({ map: this.mymap, rasterLayerGroup: rasterLayerGroup, objectsLayerGroup: objectsLayerGroup, controlsLayerGroup: controlsLayerGroup });

    }

    addPeilgebieden() {
        //this function adds the peilgebieden to our objectsLayerGroup
    }

    getPolygonBoundingBox() {
        let minLat = this.state.markers[0]._latlng.lat;
        let maxLat = this.state.markers[0]._latlng.lat;
        let minLng = this.state.markers[0]._latlng.lng;
        let maxLng = this.state.markers[0]._latlng.lng;
        this.state.markers.forEach(n => {
            if (n._latlng.lat < minLat) { minLat = n._latlng.lat }
            if (n._latlng.lng < minLng) { minLng = n._latlng.lng }
            if (n._latlng.lat > maxLat) { maxLat = n._latlng.lat }
            if (n._latlng.lng > maxLng) { maxLng = n._latlng.lng }
        });
        return ([minLat, minLng, maxLat, maxLng]);
    }

    clearMapObjects() {
        this.setState({ markers: [], points: [], polylines: [] });
        this.state.controlsLayerGroup.clearLayers();
    }

    addPolyLine(from, to, layergroup) {
        if (this.props.featureType === 'polyline') {
            //remove the temporary polyline if still present
            if (this.state.temppolyline1) {
                this.state.temppolyline1.remove();
            };
            this.state.polylines.push(new window.L.polyline([from._latlng, to._latlng], {
                color: '#D60059',
                weight: 3,
                smoothFactor: 1
            }).addTo(layergroup).on('click', (e) => {
            }
            ))
            if (this.state.polylines.length === 1) {
                this.showPopup({ type: "POLYLINE", start: from._latlng, end: to._latlng, ...this.state.polylines[0] });
            }
        } else if (this.props.featureType === 'polygon') {
            if (this.state.temppolyline1) { this.state.temppolyline1.remove() }
            if (this.state.temppolyline2) { this.state.temppolyline2.remove() }
            this.state.polylines.push(new window.L.polyline([from._latlng, to._latlng], {
                color: '#D60059',
                weight: 3,
                smoothFactor: 1
            }).addTo(layergroup).on('click', (e) => {
            }
            ))
            //only if the polygon is complete (4 polylines) will we show the popup
            if (this.state.polylines.length === 4) {
                this.showPopup({ type: "POLYGON", start: from._latlng, end: to._latlng, ...this.state.polylines[0] });
            }
        }
    }

    drawTemporaryPolyLine(from, to, layergroup, mymap,) {
        if (this.props.featureType === 'polyline') {
            if (this.state.temppolyline1) { this.state.temppolyline1.remove() };
            this.state.temppolyline1 = new window.L.polyline([from._latlng, to._latlng], {
                color: '#D60059',
                weight: 3,
                smoothFactor: 1
            }).addTo(layergroup).on('click', (e) => {
            }
            );
        } else if (this.props.featureType === 'polygon') {
            //remove our temporary polyline
            if (this.state.temppolyline1) { this.state.temppolyline1.remove() };
            if (this.state.temppolyline2) { this.state.temppolyline2.remove() };

            if (this.state.points.length === 1) {
                //draw our first polyline
                this.state.temppolyline1 = new window.L.polyline([from._latlng, to._latlng], {
                    color: '#D60059',
                    weight: 3,
                    smoothFactor: 1
                }).addTo(layergroup).on('click', (e) => {
                }
                );
            } else if (this.state.points.length === 2) {
                this.state.temppolyline1 = new window.L.polyline([from._latlng, to._latlng], {
                    color: '#D60059',
                    weight: 3,
                    smoothFactor: 1
                }).addTo(layergroup).on('click', (e) => {
                }
                );
            } else if (this.state.points.length === 3) {
                this.state.temppolyline1 = new window.L.polyline([from._latlng, to._latlng], {
                    color: '#D60059',
                    weight: 3,
                    smoothFactor: 1
                }).addTo(layergroup).on('click', (e) => {
                }
                );
            }
        }
    }

    plotLayers() {
        if (this.props.mapLayers) {
            for (let mapLayer of this.props.mapLayers) {
                switch (mapLayer.type) {
                    case "WMS":
                        var wmsLayer = window.L.tileLayer.wms(mapLayer.URL, {
                            layers: mapLayer.layer,
                            format: 'image/png',
                            transparent: true
                        }).addTo(this.state.rasterLayerGroup);
                        break;
                    case "LONLAT":

                }
            }
        }

    }

    async geocode(latlng) {
        return new Promise((res, rej) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        res(results[0].address_components[2] ? results[0].address_components[2].long_name : results[0].address_components[0].long_name);
                    }
                } else {
                    rej("Geocoder failed due to: " + status);
                }
            });
        })
    }

    async showPopup(selectedmapobject) {
        if (selectedmapobject.type === "POLYLINE") {
            this.props.openContextPanel();
            let placeA = await this.geocode(selectedmapobject.start);
            let placeB = await this.geocode(selectedmapobject.end);
            this.props.setMarker({ startPlace: placeA, endPlace: placeB, ...selectedmapobject });
        } else if (selectedmapobject.type === "POINT") {
            this.props.openContextPanel();
            let placeA = await this.geocode(selectedmapobject.start);
            this.props.setMarker({ startPlace: placeA, ...selectedmapobject });
        } else if (selectedmapobject.type === "POLYGON") {
            this.props.setPolygonExtent(this.getPolygonBoundingBox());
            this.props.openContextPanel();
            let placeA = await this.geocode(selectedmapobject.start);
            let placeB = await this.geocode(selectedmapobject.end);
            this.props.setMarker({ startPlace: placeA, endPlace: placeB, ...selectedmapobject });
        }
    }

    render() {

        // //first set the background maps
        // if (this.props.mapLayerSelection.watervlakken) {

        if (this.props.mapLayerSelection.watervlakken){
            this.mymap.addLayer(this.waterlayer);
        } else if (this.waterlayer) {
            this.mymap.removeLayer(this.waterlayer);
        }


        if (this.state.prevFeatureType !== null && this.state.prevFeatureType !== this.props.featureType) {
            this.clearMapObjects();
        }
        this.state.prevFeatureType = this.props.featureType;


        let bottomContextPanel = <ContextPanel position="bottom" />;
        let rightContextPanel = false ? <ContextPanel position="right" /> : <div />;
        if (this.state.map) { this.plotLayers() }
        return (<div style={{ flex: 1, display: "flex" }}><LayerPanel />
            <div style={{ flexDirection: "column", flex: 1, display: "flex" }}>
                <div id="map">
                </div>
                {bottomContextPanel}
            </div>{rightContextPanel}</div>);
    }
}

function mapStateToProps(state) {
    return {
        mapLayers: state.mapLayers,
        panelIsOpen: state.panelOpen,
        selectedMarker: state.selectedMarker,
        featureType: state.featureType,
        mapLayerSelection: state.mapLayerSelection
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setMarker: (marker) => dispatch(objectActions.selectMarker(marker)),
        togglePanel: () => dispatch(objectActions.togglePanel()),
        setPointData: (data) => dispatch(objectActions.setPointData(data)),
        setPolygonExtent: (extent) => dispatch(objectActions.setPolygonExtent(extent)),
        openContextPanel: () => dispatch(objectActions.openContextPanel())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);