import React, { Component } from 'react';
import {
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    Bar,
    Line,
    Brush,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

class ComposedChartWidget extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="tile_count">
                <div className="tile_stats_count">
                    <span className="count_top">
                        <i className={'fa fa-' + this.props.iconName}></i>
                        {" " + this.props.titleText}
                    </span>
                    <div className={'count ' + (this.props.countColor ? this.props.countColor : '')}>
                        <h4><b>{this.props.countValue}</b></h4>
                    </div>
                    <div className="count_bottom">
                        <ResponsiveContainer height={this.props.height} width="100%">
                            <ComposedChart data={this.props.data}>
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                {
                                    this.props.displayGrid &&
                                    <CartesianGrid strokeDasharray="3 3" />
                                }
                                {
                                    this.props.showTooltip &&
                                    <Tooltip />
                                }
                                {
                                    this.props.showLegend &&
                                    <Legend />
                                }
                                {
                                    this.props.showBrush &&
                                    <Brush dataKey='name' height={15} />
                                }
                                {
                                    this.props.keys.map(element => {
                                      if(element.keyType=='Bar'){
                                        return (
                                            <Bar
                                                onClick={this.props.handleClick}
                                                dataKey={element.key}
                                                fill={element.color}
                                                yAxisId={element.yAxisId}
                                            />
                                        );
                                      }
                                      if(element.keyType=='Line'){
                                        return (
                                            <Line
                                                onClick={this.props.handleClick}
                                                dataKey={element.key}
                                                stroke={element.color}
                                                yAxisId={element.yAxisId}
                                            />
                                        );
                                      }
                                      if(element.keyType=='Area'){
                                        return (
                                            <Area
                                                onClick={this.props.handleClick}
                                                dataKey={element.key}
                                                fill={element.color}
                                                stroke={element.color}
                                                yAxisId={element.yAxisId}
                                            />
                                        );
                                      }

                                    })
                                }
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div >
            </div>
        );
    }
}

export default ComposedChartWidget;
