import React, { Component } from 'react';

class CountTile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span className="count_top">
                    <i className={'fa fa-' + this.props.iconName}></i>
                    {" " + this.props.titleText}
                </span>
                <div className={'count ' + (this.props.countColor ? this.props.countColor : '')}>
                    {this.props.countValue}
                </div>
                <span className="count_bottom">
                    <i className={this.props.changeColor}>
                        <i className={'fa fa-sort-' + this.props.sortOrder}></i>
                        {this.props.changePercentage + "% "}
                    </i>
                    {this.props.descText}
                </span>
            </div>
        );
    }
}

export default CountTile;
