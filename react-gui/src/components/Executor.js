import React, { Component } from "react";

export default class Executor extends Component {
    render() {
        const { executor } = this.props;
        const actions = executor.actions;
        const actuators = executor.actuators;
        const sensors = executor.sensors;

        return (
            <div>
                <div className="field-wrapper">
                    <p className="title executor mb-1">
                        <span className="w-100">{executor.description}</span>
                    </p>
                    <p className="value d-flex justify-content-between">
                        <span className="w-60">Name: </span> <span className="w-40 uc-first">{executor.name}</span>
                    </p>
                    <p className="value d-flex justify-content-between">
                        <span className="w-60">State: </span> <span className="w-40">{executor.state ? 'enabled' : 'disabled'}</span>
                    </p>
                    <p className="value d-flex justify-content-between">
                        <span className="w-60">Last action requested: </span> 
                        <span className="w-40">{executor.last_action ? executor.last_action.command : ""}</span>
                    </p>
                    <div className="sub-field my-2">
                        <span className="headline-small">Robot actuators: </span>{" "}
                        <div className="w-100 pl-3">
                            {actuators.map((actutor, j) => (
                                <div key={j} className="my-1">
                                    <p className="title d-flex justify-content-between">
                                        <span className="w-100">{actutor.description}</span>
                                    </p>
                                    <p className="value d-flex justify-content-between">
                                        <span className="w-60">Status: </span> <span className="w-40">{actutor.value ? "Blinking" : "Off"}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sub-field my-2">
                        <span className="headline-small">Robot sensors: </span>{" "}
                        <div className="w-100 pl-3">
                            {sensors.map((sensor, j) => (
                                <div key={j} className="my-1">
                                    <p className="title d-flex justify-content-between">
                                        <span className="w-60">{sensor.description}</span>{" "}
                                    </p>
                                    <p className="value d-flex justify-content-between">
                                        <span className="w-60">Value: </span> <span className="w-40">{sensor.value}</span>
                                    </p>
                                    <p className="unit d-flex justify-content-between">
                                        <span className="w-60">Unità di misura:</span> <span className="w-40">{sensor.unit}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sub-field my-2">
                        <span className="headline-small">Possible actions: </span>{" "}
                        <div className="w-100 pl-3">
                            {actions.map((action, j) => (
                                <div key={j} className="my-1">
                                    <p className="value d-flex justify-content-between">
                                        <span className="w-60">command: </span> <span className="w-40">{action.command}</span>
                                    </p>
                                    <p className="value d-flex justify-content-between">
                                        <span className="w-60">effect: </span> <span className="w-40">{action.name}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
