import React, { Component } from 'react';
import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

class LineChartWidget extends Component {
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
                            <LineChart data={this.props.data}>
                                <XAxis dataKey="name" />
                                <YAxis />
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
                                    this.props.keys.map((element,index) => {
                                        return (
                                            <Line
                                                onClick={this.props.handleClick}
                                                dataKey={element.key}
                                                stroke={element.color}
                                                activeDot={{r: (element.activeDot ? index+3 : 4 ) }}
                                            />
                                        );
                                    })
                                }
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default LineChartWidget;
