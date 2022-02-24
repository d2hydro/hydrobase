import { connect } from 'react-redux';
import React, { Component } from 'react';
import { objectActions } from '../redux/store';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import RoomIcon from '@material-ui/icons/Room';
import TimelineIcon from '@material-ui/icons/Timeline';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';

require('./Colofon.css');

class Colofon extends React.Component {


    render() {
        return <div><div id="overlay"></div><div id="colofon">
            <IconButton id="closebutton" onClick={this.props.closeColofon} >
                <Icon className="fa fa-times-circle" />
            </IconButton>

            <h1>Over hydrobase</h1>
            <div id="popupbody">Hydrobase ondersteunt hydrologen bij het semi-automatisch bouwen van hydrologische en hydraulische modelschematisaties. De service ontsluit daartoe gegevens uit diverse bronnen, toont ze in onderlinge samenhang en biedt ze aan ter download. In eerste aanleg werd Hydrobase ontworpen om de data klaar te zetten voor het vervaardigen van <a href="https://www.deltares.nl/en/software/wflow-hydrology/" target="_blank">WFlow-modellen</a>, maar de ambitie is om spoedig ondersteuning voor andere modelcodes toe te voegen.</div>
            <br/>
            <div id="popupbody">Hydrobase ontsluit gegevens uit de volgende bronnen:
            <ul>
                <li>Hoogtegegevens (AHN3, DSM en DTM)</li>
                <li>Zomer- en winterstreefwaterstanden</li>
                <li>Onderwaterprofiel</li>
            </ul>
            </div>
            <div id="popupbody">U kunt deze gegevens van de kaart opvragen op drie manieren:
            <ul>
                <li><RoomIcon id="locationmarker" />Door te prikken (puntgegevens)</li>
                <li><TimelineIcon id="pathmarker" />Door een lijn te trekken</li>
                <li><FormatShapesIcon id="polygonmarker" />Door een vierhoek te tekenen</li>
            </ul>
            </div>
            <div id="popupbody">Klik in het linkerpaneel op één van de drie knoppen (punt, lijn, vierhoek) en teken op de kaart!</div>
            <div id="popupbody">Zodra de selectie compleet is wordt de opgevraagde informatie getoond in een nieuw paneel.</div>
            <br/>
            <div id="popupbody">Hydrobase werd gebouwd door D2Hydro en Hydroconsult</div>
            <div id="popupbody">Launching partner: Hoogheemraadschap de Stichtse Rijnlanden</div>

            <div id="logos">
                <img src="/HDSR-logo-liggend.png" className="logo" />
                <img src="/D2Logo.png" className="logo" />
                <img id="logohc" src="/HYDRO_LOGO_DEF.png" className="logo" />
            </div>

        </div></div>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        closeColofon: () => dispatch(objectActions.closeColofon())
    }
}

export default connect(null, mapDispatchToProps)(Colofon);