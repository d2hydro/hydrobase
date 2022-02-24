import React, { Component } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { connect } from 'react-redux';
import {objectActions} from '../redux/store';

// import 'react-checkbox-tree/lib/react-checkbox-tree.css';


class LayerTree extends Component {
    state = {
        checked: [],
        expanded: [],
    };

    componentDidMount() {
        this.props.loadData();
    }

    render() {
            if (this.props.data) { return (
                <CheckboxTree
                nodes={this.props.data}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={
                    checked => { 
                        let childnodes = [];
                       // this.props.setMapLayers(checked);
                        for (let node of this.props.data) {
                            if (node.children) {
                                for (let childnode of node.children) {
                                    if (checked.includes(childnode.label)){
                                        childnodes.push(childnode);
                                    }
                                }
                            }
                        }
                      //  this.props.setMapLayers(childnodes)
                        return  this.setState({ checked })
                    }
                }
                onExpand={expanded => this.setState({ expanded })}
            />)
            } else { return (<div></div>)            }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setMapLayers:(maps) => dispatch(objectActions.setMapLayers(maps)),
        loadData:() => dispatch(objectActions.loadData())
    }
}

export default connect(state => {return{data: state.data}}, mapDispatchToProps)(LayerTree);
