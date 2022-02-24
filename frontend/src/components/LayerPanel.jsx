import React, { Component } from 'react';
import { connect } from 'react-redux';
import { objectActions } from '../redux/store';
import ToggleButton from '@material-ui/lab/ToggleButton';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import InfoIcon from '@material-ui/icons/Info';
import LinkIcon from '@material-ui/icons/Link';
// import LinkIcon from '@mui/icons-material/Link';
// import LinkIcon from '@mui/icons-material/Link';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import SettingsIcon from '@material-ui/icons/Settings';
import BookIcon from '@material-ui/icons/Book';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import RoomIcon from '@material-ui/icons/Room';
import TimelineIcon from '@material-ui/icons/Timeline';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import Tooltip from '@material-ui/core/Tooltip';

require('./LayerPanel.css');

class LayerPanel extends Component {
    state = {}

    constructor() {
        super();
        this.checkedChanged = this.checkedChanged.bind(this);
        this.close = this.close.bind(this);
        this.setChartSelection = this.setChartSelection.bind(this);
    }

    componentDidMount() {
    }

    checkedChanged(items) {
        this.state.setData(items);
    }

    close() {
        this.props.togglePanel()
    }

    setMapLayerSelection(e) {
        let mapLayerSelection = this.props.mapLayerSelection;

        if (e.target.id === 'watervlakken'){
            mapLayerSelection.watervlakken = !mapLayerSelection.watervlakken;
        } else if (e.target.id === 'peilgebieden'){
            mapLayerSelection.peilgebieden = !mapLayerSelection.peilgebieden;
        }
        
        //force an update
        this.props.setMapLayerSelection(null);

        //write the adjusted objectSelection to store
        this.props.setMapLayerSelection(mapLayerSelection);

        // this.setState();
        this.forceUpdate();

    }

    setChartSelection(e) {

        let chartSelection = this.props.chartSelection;

        if (e.target.id === 'DEM') {
            chartSelection.DEM = !chartSelection.DEM;
        } else if (e.target.id === 'DTM'){
            chartSelection.DTM = !chartSelection.DTM;
        } else if (e.target.id === 'zomerpeil'){
            chartSelection.zomerpeil = !chartSelection.zomerpeil;
        } else if (e.target.id === 'winterpeil'){
            chartSelection.winterpeil = !chartSelection.winterpeil;
        } else if (e.target.id === 'profiel'){
            chartSelection.profiel = !chartSelection.profiel;
        }

        //force an update
        this.props.setChartSelection(null);

        //write the adjusted objectSelection to store
        this.props.setChartSelection(chartSelection);

        // this.setState();
        this.forceUpdate();

    }

    render() {
        let panelStyle = this.props.panelIsOpen ? "" : "closed";
        let view;

        const handleChange = (event, selectedView) => {
            this.props.setFeaturetype(selectedView);
            // setView(nextView);
        };

        return (
            <div id="layerpanel" className={panelStyle}>
                <div id="panelcontent">
                    <div className="panelheader">Opties</div>
                    <hr className="divider"></hr>
                    <div className="sectionheader">Kaartlagen</div>
                    <div className="layerpanelblock">
                        <div className="layerpanelitem"><input type="checkbox" id="watervlakken" onChange={this.setMapLayerSelection.bind(this)} />watervlakken</div>
                    </div>
                    <hr className="divider"></hr>
                    <div className="sectionheader">Grafiekcomponenten</div>
                    <div className="layerpanelblock">
                        <div className="layerpanelitem"><input type="checkbox" id="DEM" checked={this.props.chartSelection.DEM} onChange={this.setChartSelection.bind(this)} />hoogte (DEM)</div>
                        <div className="layerpanelitem"><input type="checkbox" id="DTM" checked={this.props.chartSelection.DTM} onChange={this.setChartSelection.bind(this)} />maaiveldhoogte (DTM)</div>
                        <div className="layerpanelitem"><input type="checkbox" id="zomerpeil" checked={this.props.chartSelection.zomerpeil} onChange={this.setChartSelection.bind(this)} />zomerpeil</div>
                        <div className="layerpanelitem"><input type="checkbox" id="winterpeil" checked={this.props.chartSelection.winterpeil} onChange={this.setChartSelection.bind(this)} />winterpeil</div>
                        <div className="layerpanelitem"><input type="checkbox" id="profiel" checked={this.props.chartSelection.profiel} onChange={this.setChartSelection.bind(this)} />onderwaterprofiel</div>
                    </div>
                    <hr className="divider"></hr>
                </div>
                <div id="buttons">
                    <ToggleButtonGroup orientation="vertical" onChange={this.props.togglePanel}>
                        <Tooltip title={"Klap het lagenpaneel open."}>
                            <ToggleButton id="buttonopenclose" value="list" aria-label="list">
                                {this.props.panelIsOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={handleChange}>
                        <Tooltip title={"Klik op de kaart om puntinformatie op te vragen."}>
                            <ToggleButton className="buttonfeaturetype" value="point" aria-label="list" selected={this.props.featureType === 'point'}>
                                <RoomIcon id="locationmarker" />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title={"Klik op twee locaties op de kaart om een lijn te trekken."}>
                            <ToggleButton className="buttonfeaturetype" value="polyline" aria-label="module" selected={this.props.featureType === 'polyline'}>
                                <TimelineIcon id="pathmarker" />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title={"Teken een polygoon op de kaart."}>
                            <ToggleButton id="polygonmarkerbutton" value="polygon" aria-label="quilt" selected={this.props.featureType === 'polygon'}>
                                <FormatShapesIcon id="polygonmarker" />
                            </ToggleButton>
                        </Tooltip>
                        {/* <Tooltip title={"Handleiding"}>
                            <IconButton id="manualbutton" value="colofon" aria-label="quilt" onClick={this.props.openManual}>
                                <LibraryBooksOutlinedIcon id="manualmarker" />
                            </IconButton>
                        </Tooltip> */}
                        <Tooltip title={"modelbouwscripts"}>
                            <IconButton id="sourcesbutton" value="colofon" aria-label="quilt" onClick={this.props.openSources}>
                                <SettingsIcon id="sourcesmarker" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"handleiding"}>
                            <IconButton id="colofonbutton" value="colofon" aria-label="quilt" onClick={this.props.openColofon}>
                                <InfoIcon id="colofonmarker" />
                            </IconButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                </div>
            </div>);
    }
}

function mapStateToProps(state) {
    return {
        panelIsOpen: state.panelOpen,
        featureType: state.featureType,
        chartSelection: state.chartSelection,
        mapLayerSelection: state.mapLayerSelection
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setData: (data) => dispatch(objectActions.setData(data)),
        setFeaturetype: (featureType) => dispatch(objectActions.setFeaturetype(featureType)),
        togglePanel: () => dispatch(objectActions.togglePanel()),
        openColofon: () => dispatch(objectActions.openColofon()),
        openSources: () => dispatch(objectActions.openSources()),
        openManual: () => dispatch(objectActions.openManual()),
        setChartSelection: (chartSelection) => dispatch(objectActions.setChartSelection(chartSelection)),
        setMapLayerSelection: (mapLayerSelection) => dispatch(objectActions.setMapLayerSelection(mapLayerSelection))
    }
}




export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
