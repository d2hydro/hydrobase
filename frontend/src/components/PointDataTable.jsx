import { connect } from 'react-redux';
import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ThreeSixty } from '@material-ui/icons';





class PointDataTable extends Component {
    state = {}

    constructor() {
        super();

        // this.test =            
        // {
        //     data: {
        //         "waterschap": "HDSRS",
        //         "streefpeil": 2.0    
        //     }            
        // }
        this.rows = [
            this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
            this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
            this.createData('Eclair', 262, 16.0, 24, 6.0),
            this.createData('Cupcake', 305, 3.7, 67, 4.3),
            this.createData('Gingerbread', 356, 16.0, 49, 3.9),
        ];
        this.classes = makeStyles({
            table: {
                minWidth: 700,
            },
        });

        this.StyledTableRow = withStyles((theme) => ({
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
            },
        }))(TableRow);


        this.StyledTableCell = withStyles((theme) => ({
            head: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            body: {
                fontSize: 14,
            },
        }))(TableCell);

    }


    createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }



    render() {
        let properties = this.props.pointData.features[0].properties;
        let headers = [];
        let rows = []; 
        Object.keys(properties).forEach((key, index) => {
            headers.push(<this.StyledTableCell>{key}</this.StyledTableCell>)
            rows.push(<this.StyledTableCell>{properties[key]}</this.StyledTableCell>)            
        });

        return (
            <TableContainer component={Paper}>
                <Table className={this.classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {headers}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    <this.StyledTableRow>
                                {rows}
                            </this.StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}


function mapStateToProps(state) {
    return {
        pointData: state.pointData,
    }
}


export default connect(mapStateToProps)(PointDataTable);