import React, { Component } from 'react';
import Box from './Box';
import moment from 'moment';

export default class Map extends Component {
    render() {
        const { map } = this.props;
        console.log(map);
        return (
            <div className="map-container mt-5 text-center">
                <h4 className="title">{map.name}</h4>
                <span className="map-date">({moment(map.date).format('DD-MM-YYYY HH:mm:ss')})</span>

                <i className="fas fa-caret-down button-collapse" data-toggle="collapse" data-target="#mapCollampse" aria-expanded="true" aria-controls="mapCollampse" />

                <hr />
                <div className="collapse" id="mapCollampse">
                    <div className="map-wrapper">
                        {map.boxes.map((row, i) => (
                            <div key={i}>
                                {row.map((box, j) => (
                                    <Box key={(i + 1) * (j + 1)} box={box} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
