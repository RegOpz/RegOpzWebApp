import React,{Component} from 'react';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import BarChart from './../Widgets/BarChart';
import PieChart from './../Widgets/PieChart';
import LineChart from './../Widgets/LineChart';
import ComposedChart from './../Widgets/ComposedChart';
import WidgetHoc from './../Widgets/WidgetHOC';

class VarianceAnalysisChart extends Component{
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){
    //this.data=nextProps.chart_data;
  }

  render(){
    if(this.props.chartData.data.length>0){
      var chartData = this.props.chartData;
      var chartType =  BarChart;
      if (this.props.chartType == "PieChart") {
        chartType = PieChart;
      } else if (this.props.chartType == "LineChart") {
        chartType = LineChart;
      } else if (this.props.chartType == "ComposedChart"){
        chartType = ComposedChart;
      }
      var tileType = this.props.tileType;
      var ChartWithHOC = WidgetHoc(chartType, tileType);
      var keys = [];
      let color=['#3498DB','#1ABB9C','#9B59B6','#9CC2CB','#E74C3C',];
      let keyAttributes = [];
      if(this.props.keys){
        keyAttributes = this.props.keys;
      } else {
        for (var att in chartData.data[0]){
          keyAttributes.push({"key": att});
        }
      }
      if(keyAttributes){
        keyAttributes.map((key,index)=> {
            let keyIndex = index == 0 ? index : index - 1;
            if (key.key !== 'name'){
                keys.push({
                    key: key.key,
                    keyType: key.keyType ? key.keyType : "",
                    yAxisId: key.yAxisId ? key.yAxisId : "left",
                    color: key.color ? key.color : color[keyIndex],
                    innerRadius: (keyIndex * 30),
                    outerRadius: (keyIndex * 30 + 30)
                });
            }
        })
      }
      //console.log("Inside chartdata",this.props.chartType,chartData,keys,keyAttributes,chartData.data[0])
      return (
          <ChartWithHOC
              height={ this.props.height ? this.props.height : 300}
              iconName={'bandcamp'}
              titleText={chartData.title}
              countColor={chartData.rate === 'inc' ? 'green' : 'red'}
              countValue={chartData.value}
              showBrush={ this.props.showBrush }
              data={chartData.data}
              keys={keys}
              showTooltip={true}
          />
      )
    }
  }
}

export default VarianceAnalysisChart;
