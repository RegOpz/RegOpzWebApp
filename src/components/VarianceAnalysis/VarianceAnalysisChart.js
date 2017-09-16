import React,{Component} from 'react';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import BarChart from './../Widgets/BarChart';
import PieChart from './../Widgets/PieChart';
import LineChart from './../Widgets/LineChart';
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
      var chartType = BarChart;
      var tileType = this.props.tileType; //"one_third";
      var ChartWithHOC = WidgetHoc(chartType, tileType);
      var keys = [];
      let color=['#3498DB','#1ABB9C','#9B59B6','#9CC2CB','#E74C3C',]
      let index = 0;
      for (var key in chartData.data[0]) {
          if (key !== 'name'){
              keys.push({
                  key: key,
                  color: color[index],
                  innerRadius: (index * 30),
                  outerRadius: (index * 30 + 30)
              });
              index++;
          }
      }
      console.log("Inside chartdata",chartData,keys)
      return (
          <ChartWithHOC
              height={ this.props.height ? this.props.height : 300}
              iconName={'bandcamp'}
              titleText={chartData.title}
              countColor={chartData.rate === 'inc' ? 'green' : 'red'}
              countValue={chartData.value}
              data={chartData.data}
              keys={keys}
              showTooltip={true}
          />
      )
    }
  }
}

export default VarianceAnalysisChart;
