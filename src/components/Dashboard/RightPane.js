import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CountTile from './../Widgets/CountTile';
import BarChart from './../Widgets/BarChart';
import PieChart from './../Widgets/PieChart';
import LineChart from './../Widgets/LineChart';
import WidgetHoc from './../Widgets/WidgetHOC';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchUserServices } from './../../actions/CustomizeDashAction';

class RightPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tileMappings: {
                1: 'one_third',
                2: 'half',
                3: 'full_width'
            },
            chartMappings: {
                1: BarChart,
                2: LineChart,
                3: PieChart
            }
        };
    }

    componentWillMount() {
        this.props.fetchUserServices();
    }

    render() {
        return (
            <div className="row tile_count">
                <CountTile
                    iconName="user"
                    titleText="Number of reports"
                    countValue="2500"
                    changeColor="green"
                    sortOrder="asc"
                    changePercentage="4"
                    descText="From Last Week"
                />
                <CountTile
                    iconName="clock-o"
                    titleText="Average Time"
                    countValue="123.50"
                    changeColor="green"
                    sortOrder="asc"
                    changePercentage="34"
                    descText="From Last Week"
                />
                <CountTile
                    iconName="user"
                    titleText="Data Feeds"
                    countValue="2,500"
                    countColor="green"
                    changeColor="green"
                    sortOrder="asc"
                    changePercentage="34"
                    descText="From Last Week"
                />
                <CountTile
                    iconName="user"
                    titleText="Number of Errors"
                    countValue="4,567"
                    changeColor="red"
                    sortOrder="desc"
                    changePercentage="12"
                    descText="From Last Week"
                />
                <CountTile
                    iconName="user"
                    titleText="Adjustments"
                    countValue="2,315"
                    changeColor="green"
                    sortOrder="asc"
                    changePercentage="34"
                    descText="From Last Week"
                />
                <CountTile
                    iconName="user"
                    titleText="Business Rules"
                    countValue="7,325"
                    changeColor="green"
                    sortOrder="asc"
                    changePercentage="34"
                    descText="From Last Week"
                />
                {
                    this.props.user_services.map(element => {
                        var chartData = element.apiData;
                        var chartType = this.state.chartMappings[element.chartType];
                        var tileType = this.state.tileMappings[element.tileType];
                        var ChartWithHOC = WidgetHoc(chartType, tileType);
                        var keys = [];
                        let index = 0;
                        for (var key in chartData.data[0]) {
                            if (key !== 'name'){
                                keys.push({
                                    key: key,
                                    color: 'red',
                                    innerRadius: (index * 30),
                                    outerRadius: (index * 30 + 30)
                                });
                                index++;
                            }
                        }
                        return (
                            <ChartWithHOC
                                height={300}
                                iconName={'bandcamp'}
                                titleText={chartData.title}
                                countColor={chartData.rate === 'inc' ? 'green' : 'red'}
                                countValue={chartData.value}
                                data={chartData.data}
                                keys={keys}
                                showTooltip={true}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user_services: state.customize_dash
    }
}

const matchDispatchToProps = (dispatch) => {
    return {
        fetchUserServices: () => {
            dispatch(actionFetchUserServices());
        }
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(RightPane);
