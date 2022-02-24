import React, { Component } from 'react';
import { connect } from 'react-redux';
import {objectActions} from '../redux/store';
import LayerListSection from './LayerListSection'; 


class LayerList extends Component {
    state = {  }

    componentDidMount() {
        this.props.loadData();
    }

    render() { 
        if (this.props.data) {
            return ( 
        <div>
            {
                this.props.data.map(d => <LayerListSection key={d.value} section={d} />)
            }
        </div> );
    }
        return <div></div>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setMapLayers:(maps) => dispatch(objectActions.setMapLayers(maps)),
        loadData:() => dispatch(objectActions.loadData())
    }
}

export default connect(state => {return{data: state.data}}, mapDispatchToProps)(LayerList);
