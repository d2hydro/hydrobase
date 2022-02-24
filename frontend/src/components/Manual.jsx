import { connect } from 'react-redux';
import React, { Component } from 'react';
import { objectActions } from '../redux/store';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import RoomIcon from '@material-ui/icons/Room';
import TimelineIcon from '@material-ui/icons/Timeline';


require('./Manual.css');

class Manual extends React.Component {


    render() {
        return <div><div id="overlay"></div><div id="manual">

            <IconButton id="closebutton" onClick={this.props.closeManual} >
                <Icon className="fa fa-times-circle" />
            </IconButton>

            <h1>Handleiding Hydrobase</h1>
            <p>Hydrobase ontsluit de volgende soorten hydrologische gegevens:</p>
            <ul>
                <li>Hoogtegegevens incl. gebouwen en begroeiïng (AHN3, DSM)</li>
                <li>Hoogtegegevens maaiveld (AHN3, DTM)</li>
                <li>Winterstreefwaterstand (Winterpeil)</li>
                <li>Zomerstreefwaterstand (Zomerpeil)</li>
                <li>Onderwaterprofiel</li>
            </ul>
            <p>U kunt deze gegevens van de kaart opvragen op drie manieren:</p>
            <ul>
                <li><RoomIcon id="locationmarker" />Door te prikken (puntgegevens)</li>
                <li><TimelineIcon id="pathmarker" />Door een lijn te trekken</li>
                <li><FormatShapesIcon id="polygonmarker" />Door een polygoon te tekenen</li>
            </ul>
            <p>Klik in het linkerpaneel op één van de drie knoppen (punt, lijn, polygoon) en teken op de kaart!</p>
            <p>Zodra de selectie compleet is wordt de opgevraagde informatie getoond in een nieuw paneel.</p>

        </div></div>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        closeManual: () => dispatch(objectActions.closeManual())
    }
}

export default connect(null, mapDispatchToProps)(Manual);