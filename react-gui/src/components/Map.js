import React, { Component } from 'react';
import Box from './Box';
import moment from 'moment';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: true
        };
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    toggleOpen = () => {
        const { isOpened } = this.state;
        this.setState({ isOpened: !isOpened });
    };

    render() {
        const { map } = this.props;
        const { isOpened } = this.state;
        console.log(map, isOpened);
        return (
            <div className="map-container mt-5 text-center">
                <h4 className="title">{map.name}</h4>
                <span className="map-date">({moment(map.date).format('DD-MM-YYYY HH:mm:ss')})</span>

                <i className={isOpened ? 'fas opened button-collapse' : 'fas closed button-collapse'} onClick={this.toggleOpen} title="Toggle map" />

                <hr />
                <div className={isOpened ? 'map-box show' : 'map-box'}>
                    <div className="map-wrapper text-left">
                        {map.boxes.map((row, i) => (
                            <div key={i}>
                                {row.map((box, j) => (
                                    <Box key={(i + 1) * (j + 1)} box={box} currentDirection={map.currentDirection} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="legend mt-4">
                    <h6>Legend</h6>
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <div className="legend-item">
                                <div className="box">
                                    <div className="dirty" />
                                </div>
                                <span className="legend-text"> Box is dirty</span>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="legend-item">
                                <div className="box">
                                    <div className="clean" />
                                </div>
                                <span className="legend-text"> Box is clean</span>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <div className="legend-item">
                                <div className="box">
                                    <div className="obstacle" />
                                </div>
                                <span className="legend-text"> Box is an obstacle</span>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="legend-item">
                                <div className="box">
                                    <div className="robot" />
                                </div>
                                <span className="legend-text"> Robot position</span>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
