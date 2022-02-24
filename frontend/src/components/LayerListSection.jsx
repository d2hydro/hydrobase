import React, { Component } from 'react';
import { connect } from 'react-redux';
import {objectActions} from '../redux/store';
import ListSectionItem from './ListSectionItem';

class LayerListSection extends Component {

    render() { 
        if (this.props.section && this.props.section.children) {
           
        return ( 
        <ul className="layerlistsection">
            { this.props.section.children.map(c => <ListSectionItem key={c.value} node={c} title={c.value} />)}
        </ul> );
        }
        return <div></div>
    }
}
 
export default LayerListSection;