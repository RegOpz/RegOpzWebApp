import React, { Component } from 'react';

function WrappedSize(WidgetComponent, size) {
    switch (size) {
        case 'one_third':
            return function (props) {
                return (
                    <div className="col-md-4 col-sm-4 col-xs-12">
                        <div className="x_panel tile x_panel_blank">
                            <WidgetComponent {...props} />
                        </div>
                    </div>
                );
            }
            break;
        case 'half':
            return function (props) {
                return (
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="x_panel tile x_panel_blank">
                            <WidgetComponent  {...props} />
                        </div>
                    </div>
                );
            }
            break;
        case 'two_third':
            return function (props) {
                return (
                    <div className="col-md-8 col-sm-8 col-xs-12">
                        <div className="x_panel tile x_panel_blank">
                            <WidgetComponent {...props} />
                        </div>
                    </div>
                );
            }
            break;
        case 'full_width':
            return function (props) {
                return (
                    <div className="col-xs-12">
                        <div className="x_panel tile x_panel_blank">
                            <WidgetComponent  {...props} />
                        </div>
                    </div>
                );
            }
            break;
    }
}

export default WrappedSize;
