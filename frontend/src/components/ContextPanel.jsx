import { connect } from 'react-redux';
import React, { Component } from 'react';
import { objectActions } from '../redux/store';
import LineChart from './Chart';
import * as gf from '../js/generalfunctions.js';
import endpoints from '../js/endpoints.js';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import PointDataTable from './PointDataTable';
import { RecordVoiceOverSharp } from '@material-ui/icons';

require('./ContextPanel.css');

class ContextPanel extends Component {
    state = { details: null, selectedMarker: null }

    constructor() {
        super();
        this.close = this.close.bind(this);
        this.download = this.download.bind(this);
        this.downloadChartData = this.downloadChartData.bind(this);
    }

    close() {
        this.props.togglePanel()
    }



    async downloadChartData(e) {
        e.stopPropagation();

        let csvcontent = "";
        //first the header
        csvcontent = "afstand";
        if (this.props.chartSelection.DEM){
            csvcontent += ";hoogte"
        }
        if (this.props.chartSelection.DTM){
            csvcontent += ";maaiveld"
        }
        if (this.props.chartSelection.winterpeil){
            csvcontent += ";winterpeil"
        }
        if (this.props.chartSelection.zomerpeil){
            csvcontent += ";zomerpeil"
        }
        if (this.props.chartSelection.profiel){
            csvcontent += ";profiel"
        }
        csvcontent += "\n";

        //now the content
        for (let i = 1; i < this.state.details.length; i++) {
            csvcontent += this.state.details[i][0]
            let val1 = this.state.details[i][1];
            let val2 = this.state.details[i][2];
            let val3 = this.state.details[i][3];
            let val4 = this.state.details[i][4];
            let val5 = this.state.details[i][5];
            if (val1 == null){val1 = ""};
            if (val2 == null){val2 = ""};
            if (val3 == null){val3 = ""};
            if (val4 == null){val4 = ""};
            if (val5 == null){val5 = ""};
            if (this.props.chartSelection.DEM){csvcontent = csvcontent + ";" + val1;}
            if (this.props.chartSelection.DTM){csvcontent = csvcontent + ";" + val2;}
            if (this.props.chartSelection.winterpeil){csvcontent = csvcontent + ";" + val3;}
            if (this.props.chartSelection.zomerpeil){csvcontent = csvcontent + ";" + val4;}
            if (this.props.chartSelection.profiel){csvcontent = csvcontent + ";" + val5;}
            csvcontent = csvcontent + "\n";
          }

        const blob = new Blob([csvcontent]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState({ fileDownloadUrl: fileDownloadUrl },
            () => {
                this.dofileDownload.click();
                URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
                this.setState({ fileDownloadUrl: "" })
            })
    }


    async download() {
        let minxy = gf.WGS842RD(this.props.polygonExtent[0], this.props.polygonExtent[1]);
        let maxxy = gf.WGS842RD(this.props.polygonExtent[2], this.props.polygonExtent[3]);
        let body = { "bbox": [minxy[0], minxy[1], maxxy[0], maxxy[1]] }

        //fetch the results and download them to the local machine
        fetch(endpoints.APIURL + "/download", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            .then(res => res.blob())
            .then(blob => {
                var file = window.URL.createObjectURL(blob);
                window.location.assign(file);
            });
    }

    render() {

        //vier combinaties: bottom opened, bottom, right opened en right
        let panelStyle = this.props.position === "bottom" ? "bottom" : "right";
        panelStyle = this.props.panelIsOpen ? panelStyle + " opened" : panelStyle;
        panelStyle = this.props.LayerPanelIsOpen ? panelStyle + " compactwidth" : panelStyle + " fullwidth";

        let messageStyle = { height: 400 }
        let UserMessage = "Selecteer een van de drie opties en klik op de kaart."
        if (this.props.featureType === 'point') {
            messageStyle = { height: 110 }
        }
        if (this.props.selectedMarker && this.props.selectedMarker._latlngs) {
            UserMessage = "Ogenblik geduld aub..."
        }

        let chart = <div id="contextcontent">
            <div id="wait" style={messageStyle}>{UserMessage}</div>
        </div>

        if (this.props.selectedMarker) {

            //here we populate the context panel's context dependent of the chosen feature type
            if (this.props.featureType === 'point') {
                if (this.props.pointData.features && this.props.pointData.features[0]) {
                    chart = <div id="contextcontent"><PointDataTable></PointDataTable></div>
                } else {
                    chart = <div id="contextcontent"><div id="wait" style={messageStyle}>geen resultaten voor de geselecteerde locatie</div></div>
                }


            } else if (this.props.featureType === 'polyline') {

                if (this.state.details === null || this.props.selectedMarker._latlngs !== this.state.selectedMarker._latlngs) {
                    this.state.selectedMarker = this.props.selectedMarker;

                    if (this.state.selectedMarker._latlngs) {

                        //convert latlong to RD
                        let xystart = gf.WGS842RD(this.state.selectedMarker._latlngs[0].lat, this.state.selectedMarker._latlngs[0].lng);
                        let xyend = gf.WGS842RD(this.state.selectedMarker._latlngs[1].lat, this.state.selectedMarker._latlngs[1].lng);

                        let distance = Math.sqrt(Math.pow(xyend[0] - xystart[0], 2), Math.pow(xyend[1] - xystart[1], 2));
                        let pointdist = distance / 150;

                        //https://www.hydrobase.nl/api/dtm?line=127552.871%2C%20462627.39%2C%20127748.203%2C%20462290.405 

                        // //set the hydrobase URL!
                        // let URL = 'https://www.hydrobase.nl/api/digital-terrain-model?line=';
                        // URL = URL + xystart[0] + ',' + xystart[1] + ',' + xyend[0] + ',' + xyend[1];

                        // let requestbody = '{"line": [' + xystart[0] + ',' + xystart[1] + ',' + xyend[0] + ',' + xyend[1] + ']};'
                        let myArray = [xystart[0], xystart[1], xyend[0], xyend[1]];

                        // Simple POST request with a JSON body using fetch
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
                            //body: '{"line": [' + xystart[0] + ',' + xystart[1] + ',' + xyend[0] + ',' + xyend[1] + ']}'
                            body: JSON.stringify({
                                line: myArray,
                                "max_samples": 2000,
                                "layers": [
                                    "distance",
                                    "digital_surface_model",
                                    "digital_terrain_model",
                                    "target_waterlevel_winter",
                                    "target_waterlevel_summer",
                                    "canal_cross_sections"
                                ]
                            })
                        };

                        fetch('https://www.hydrobase.nl/api/profile', requestOptions)
                            .then(response => response.json())
                            .then(r => {
                                if (r.error) {
                                    this.setState({ details: [] })
                                } else {
                                    if (r.length <= 0) {
                                        this.setState({ details: [] })
                                    } else {
                                        this.setState({ details: r });
                                    }
                                }
                            })
                    }

                } else {
                    if (this.state.details != null && this.state.details.length > 0) {
                        chart = <div id="contextcontent">
                            <LineChart id="chart" markerID="Hoogteprofiel" data={this.state.details} />
                            <div id="plaatsnamen"><div>{this.props.selectedMarker.startPlace}</div><div>{this.props.selectedMarker.endPlace}</div></div>
                            <div className="profileLegend">
                                <div id="bol" />
                                <div id="lijn" />
                                <div id="pijl">▶</div>
                            </div>
                            <button className="downloadbutton" onClick={this.downloadChartData}>Download de gegevens</button>
                            <a className="hidden"
                                download="hydrobase_dwarsprofiel.csv"
                                href={this.state.fileDownloadUrl}
                                ref={e => this.dofileDownload = e}
                            ></a>

                        </div>
                    } else {
                        if (this.state.details.length === 0) {
                            chart = <div id="contextcontent"><div id="wait">Geen gegevens beschikbaar. Lijn moet over land lopen, binnen Nederland.</div></div>
                        }
                    }
                }
            } else if (this.props.featureType === 'polygon') {
                chart = <div id="contextcontent"><div id="wait">
                    <div id="twopanels">
                        <div id="leftcolumn">
                            <div id="headertext">Exporteer brongegevens voor:</div>
                            <input type="radio" value="WFlow" checked="true" name="model" label="WFlow"></input><label for="WFlow">WFlow</label><br />
                            <input type="radio" value="Modflow" name="model" label="Modflow" disabled></input><label for="Modflow">Modflow</label><br />
                            <input type="radio" value="DHydro" name="model" label="DHydro" disabled></input><label for="DHydro">D-Hydro</label><br />
                        </div>
                        <div id="rightcolumn">
                            <button id="download" onClick={this.download}>Download</button>
                        </div>
                    </div>

                </div>
                </div>
            }

            if (this.props.selectedMarker.type === "LONLAT") {
                if (this.state.details === null || this.props.selectedMarker.LOCATIEID !== this.state.selectedMarker.LOCATIEID) {
                    this.state.selectedMarker = this.props.selectedMarker;
                    fetch('http://localhost:54610/api/values/HUIDIG/96/' + this.props.selectedMarker.LOCATIEID).then(data => data.json()).then(r => this.setState({
                        details: r.map(e => { return { x: e.Herhalingstijd, y: e.Waarde } })
                    }))
                } else {
                    if (this.state.details != null && this.state.details.length > 0) {
                        chart = <div id="contextcontent">
                            <LineChart id="chart" markerID={this.props.selectedMarker.LOCATIEID} data={this.state.details} crosssections={this.state.crosssections} />
                        </div>
                    }
                    if (this.state.details.length = 0) {
                        chart = <div id="contextcontent">
                            no data available.
                        </div>
                    }
                }
            }
        }


        return (
            <div id="contextpanel" className={panelStyle}>
                <div id="contextpanelbuttons">
                    <IconButton id="buttonhidecontextpanel" onClick={this.close} aria-label="delete">
                        <ArrowDropDownIcon />
                    </IconButton>
                </div>
                <div id="contextpanelcontent">
                    {chart}
                </div>


            </div>)
    }




}



function mapStateToProps(state) {
    return {
        chartSelection: state.chartSelection,
        pointData: state.pointData,
        selectedMarker: state.selectedMarker,
        panelIsOpen: state.contextPanelOpen,
        LayerPanelIsOpen: state.panelOpen,
        featureType: state.featureType,
        polygonExtent: state.polygonExtent
    }
}


function mapDispatchToProps(dispatch) {
    return {
        togglePanel: () => dispatch(objectActions.toggleContextPanel()),
        clearSelectedMarker: () => dispatch(objectActions.clearSelectedMarker()),
        openContextPanel: () => dispatch(objectActions.openContextPanel())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextPanel);