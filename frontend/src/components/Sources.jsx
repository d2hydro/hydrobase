import { connect } from 'react-redux';
import React, { Component } from 'react';
import { objectActions } from '../redux/store';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

require('./Sources.css');

class Sources extends React.Component {


    render() {
        return <div><div id="overlay"></div><div id="colofon">

            <IconButton id="closebutton" onClick={this.props.closeSources} >
                <Icon className="fa fa-times-circle" />
            </IconButton>

            <h1>Modelbouwscripts</h1>

            <div id="popupbody">
                Hydrobase ondersteunt modelleurs bij het vervaardigen van hydrologische en hydraulische modelschematisaties.<br />
                De gegevens die u hier kunt downloaden zijn te gebruiken in o.a. de volgende modelbouwscripts:
                <ul>
                    <li><a href="https://github.com/ArtesiaWater/UGW" target="_blank">Modelbouwscript Utrechts Grondwatermodel</a></li>
                    <li>Modelbouwscript WFlow</li>
                </ul>
            </div>

        </div></div>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        closeSources: () => dispatch(objectActions.closeSources())
    }
}

export default connect(null, mapDispatchToProps)(Sources);