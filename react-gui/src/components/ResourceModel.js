import React, { Component } from "react";
import Executor from "./Executor";

export default class ResourceModel extends Component {
    render() {
        const { resourceModel, userCity } = this.props;
        const actuators = resourceModel.actuators;
        const executors = resourceModel.executors;
        const sensors = resourceModel.sensors;

        return (
            <div className="resource-model-wrapper mt-5 text-center">
                <h4 className="title">System informations</h4>
                <hr />
                <h6 className="name">Name: {resourceModel.name}</h6>
                <hr />
                <div className="system">
                    {sensors.length ? (
                        <div>
                            <div className="text-left mb-1 mt-3">
                                <h6 className="headline">System sensors</h6>
                            </div>
                            <div className="row align-item-center">
                                {sensors.map((sensor, index) => (
                                    <div key={index} className="col-12 col-md-6 my-1">
                                        <div className="field-wrapper">
                                            <p className="title d-flex justify-content-between">
                                                <span className="w-60">{sensor.description}</span>{" "}
                                                {sensor.category === "temperature" ? <span className="w-40 uc-first">{userCity}</span> : ""}
                                            </p>
                                            <p className="value d-flex justify-content-between">
                                                <span className="w-60">Value: </span> <span className="w-40">{sensor.value}</span>
                                            </p>
                                            <p className="unit d-flex justify-content-between">
                                                <span className="w-60">Unità di misura:</span> <span className="w-40">{sensor.unit}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    {actuators.length ? (
                        <div>
                            <div className="text-left mb-1 mt-3">
                                <h6 className="headline">System actuators</h6>
                            </div>
                            <div className="row align-item-center">
                                {actuators.map((actutor, index) => (
                                    <div key={index} className="col-12 col-md-6 my-1">
                                        <div className="field-wrapper">
                                            <p className="title d-flex justify-content-between">
                                                <span className="w-60">{actutor.description}</span>
                                            </p>
                                            <p className="value d-flex justify-content-between">
                                                <span className="w-60">Status: </span> <span className="w-40">{actutor.value ? "Blinking" : "Off"}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {executors.length ? (
                        <div>
                            <div className="text-left mb-1 mt-3">
                                <h6 className="headline">System executors</h6>
                            </div>
                            <div className="row align-item-center">
                                {executors.map((executor, index) => (
                                    <div key={index} className="col-12 col-md-6 my-1">
                                        <Executor executor={executor} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <hr />
                <small className="text-muted">Developed by: {resourceModel.manufacturer}</small>
            </div>
        );
    }
}
