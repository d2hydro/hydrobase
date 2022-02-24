import React, {Component} from 'react';
import { connect } from 'react-redux';
import { objectActions } from '../redux/store';
import Footer from './Footer';
import Map from './Map';
import Colofon from './Colofon';
import Manual from './Manual';
import Sources from './Sources';

class Main extends Component {
    state = {  }
    render() { 
        let colofon = null;
        let manual = null;
        let sources = null;
        if (this.props.displayColofon) {colofon = <Colofon/>} 
        if (this.props.displayManual) {manual = <Manual/>} 
        if (this.props.displaySources) {sources = <Sources/>}
        return (<div id="main"><Map/>{colofon}{manual}{sources}<Footer/></div>);
    }
}
 
function mapStateToProps(state) {
    return {
        displayColofon: state.displayColofon,
        displaySources: state.displaySources,
        displayManual: state.displayManual
    }
}



export default connect(mapStateToProps, null)(Main);