import * as React from 'react';
import { connect } from 'react-redux';
import { objectActions } from '../redux/store';

// import {
//   ArgumentAxis,
//   ValueAxis,
//   Chart,
//   LineSeries
// } from '@devexpress/dx-react-chart-material-ui';

//const scale = () => scaleLog().base(10);
//const modifyDomain = domain => [1, 1000];

import { Chart } from "react-google-charts";

function LineChart(props) {

  //convert the data into an array of arrays so we can feed it to our chart object
  let chartcontainer = [];
  let chartheader = [];
  let linecolors = [];
  let chartitem = { type: 'number', label: 'x' };
  chartheader.push(chartitem);

  if (props.chartSelection.DEM) {
    linecolors.push('darkgreen');
    chartitem = { type: 'number', label: 'hoogte' };
    chartheader.push(chartitem);
  }

  if (props.chartSelection.DTM) {
    linecolors.push('green');
    chartitem = { type: 'number', label: 'maaiveld' };
    chartheader.push(chartitem);
  }

  if (props.chartSelection.winterpeil) {
    linecolors.push('blue');
    chartitem = { type: 'number', label: 'winterpeil' };
    chartheader.push(chartitem);
  }

  if (props.chartSelection.zomerpeil) {
    linecolors.push('orange');
    chartitem = { type: 'number', label: 'zomerpeil' };
    chartheader.push(chartitem);
  }
  if (props.chartSelection.profiel) {
    linecolors.push('brown');
    chartitem = { type: 'number', label: 'profiel' };
    chartheader.push(chartitem);
  }

  //quickfix: make sure we have at least five colors defined
  linecolors.push('black');
  linecolors.push('black');
  linecolors.push('black');
  linecolors.push('black');
  linecolors.push('black');

  chartcontainer.push(chartheader);

  for (let i = 0; i < props.data.length; i++) {
    let chartrow = [];
    chartrow.push(props.data[i][0]);     //write the x value
    if (props.chartSelection.DEM){chartrow.push(props.data[i][1]);}  //write ty DEM elevation
    if (props.chartSelection.DTM){chartrow.push(props.data[i][2]);}  //write the DTM elevation
    if (props.chartSelection.winterpeil){chartrow.push(props.data[i][3]);}   //write the Winter Target Level
    if (props.chartSelection.zomerpeil){chartrow.push(props.data[i][4]);}   //write the Summer Target Level
    if (props.chartSelection.profiel){chartrow.push(props.data[i][5]);}  //write the cross section
    chartcontainer.push(chartrow);
  }

  return (
    <div className="App">
      <Chart
        width={"100%"}
        height={"200px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={chartcontainer}
        options={
          { legend: 'none' },
          {
            series: {
              0: { color: linecolors[0]},
              1: { color: linecolors[1]},
              2: { color: linecolors[2]},
              3: { color: linecolors[3]},
              4: { color: linecolors[4]},
            }
          }
        }
      />
    </div>
  );
}


function mapStateToProps(state) {
  return {
    chartSelection: state.chartSelection,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);


// function connect(mapStateToProps, mapDispatchToProps){}
