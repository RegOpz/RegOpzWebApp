import React, { Component } from 'react';
import {
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

class PieChartWidget extends Component {
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
                            <PieChart>
                                {
                                    this.props.showTooltip &&
                                    <Tooltip />
                                }
                                {
                                    this.props.keys.map((element, index) => {
                                        return (
                                            <Pie
                                                onClick={this.props.handleClick}
                                                data={this.props.data}
                                                nameKey="name"
                                                dataKey={element.key}
                                                fill={element.color}
                                                innerRadius={element.innerRadius}
                                                outerRadius={element.outerRadius}
                                                label
                                            />
                                        );
                                    })
                                }
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default PieChartWidget;
