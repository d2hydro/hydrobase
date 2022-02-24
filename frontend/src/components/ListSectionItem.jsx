import React, { Component } from 'react';
import { connect } from 'react-redux';
import {objectActions} from '../redux/store';
class ListSectionItem extends Component {

    state = { selected:false }

    constructor(){
        super();
        this.select = this.select.bind(this);
    }

    select(){
        this.setState({selected:!this.state.selected});
        if (this.state.selected) {
            this.props.removeMapLayer(this.props.node)
        } else {
            this.props.addMapLayer(this.props.node)
        }
    }

    state = {  }
    render() { 
        let className = "toggleButton"; 
        if (this.state.selected) className += " selected";
        return ( <li onClick={this.select} className={className}>
            <div className="toggleButtonContainer">
               <i className="fas fa-arrow-right"></i> {this.props.title}
            </div>
        </li> );
    }
}
 

function mapDispatchToProps(dispatch) {
    return {
        addMapLayer:(map) => dispatch(objectActions.addMapLayer(map)),
        removeMapLayer:(map) => dispatch(objectActions.removeMapLayer(map)),
    }
}

export default connect(null, mapDispatchToProps)(ListSectionItem);