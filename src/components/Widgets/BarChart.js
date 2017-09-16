import React, { Component } from 'react';
import {
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Bar,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

class BarChartWidget extends Component {
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
                            <BarChart data={this.props.data}>
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
                                    this.props.keys.map(element => {
                                        return (
                                            <Bar
                                                onClick={this.props.handleClick}
                                                dataKey={element.key}
                                                fill={element.color}
                                            />
                                        );
                                    })
                                }
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div >
            </div>
        );
    }
}

export default BarChartWidget;
