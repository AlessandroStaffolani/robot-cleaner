import React, { Component } from 'react';
import '../components-styles/console.css';
import mqtt from 'mqtt';
import { getToken } from '../utils/localStorageUtils';
import config from '../config/config';
import Alert from './Alert';
import Loading from './Loading';
import ResourceModel from './ResourceModel';
import Map from './Map';

const API_PATH = config.serverHost;

const MQTT_HOST = config.mqttUrl;
const MQTT_TOPIC = config.mqttTopic;

const KEY_BIND = {
    87: 'w',
    65: 'a',
    68: 'd',
    83: 's',
    72: 'h'
};

const COMMAND_MAPPING = {
    w: 'Forward',
    a: 'Left',
    d: 'Right',
    s: 'Backward',
    h: 'Stop'
};

const useMqtt = false;

class Gui extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            resourceModel: null,
            message: {
                value: '',
                type: 'success',
                show: false
            },
            temperature: null,
            time: null,
            command: false,
            map: null
        };

        this.clientMqtt = mqtt.connect(MQTT_HOST);
        this.clientMqtt.on('connect', () => {
            this.clientMqtt.subscribe(MQTT_TOPIC);
        });

        this.handleButtonClicked = this.handleButtonClicked.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        //this.temperatureCheck = this.temperatureCheck.bind(this);
        this.updateResourceModel = this.updateResourceModel.bind(this);
    }

    componentDidMount() {
        this.updateResourceModel();
        //this.getMapFromServer();
        this.clientMqtt.on('message', (topic, payload, packet) => {
            const payloadString = payload.toString();
            if (payloadString.indexOf('react') !== -1 && payloadString.indexOf('resource_model_update') !== -1) {
                this.updateResourceModel();
            } else if (payloadString.indexOf('react') !== -1 && payloadString.indexOf('map_ready') !== -1) {
                this.getMapFromServer();
            }
        });
    }

    handleButtonClicked = (event, command) => {
        event.preventDefault();
        let path = API_PATH + '/robot/command/' + command;

        if (useMqtt) {
            this.executeCommandMqtt(command);
        } else {
            this.executeCommandHttp(path, command);
        }
    };

    handleKeyDown = event => {
        event.preventDefault();

        let command = KEY_BIND[event.keyCode];

        if (command) {
            let path = API_PATH + '/robot/command/' + command;

            if (useMqtt) {
                this.executeCommandMqtt(command);
            } else {
                this.executeCommandHttp(path, command);
            }
        }
    };

    executeCommandHttp = (path, command) => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${getToken()}`);

        fetch(path, {
            method: 'GET',
            headers: headers
        })
            .then(result => result.json())
            .then(result => {
                console.log(result);

                /* this.setState({
                    command: COMMAND_MAPPING[command]
                }); */
            })
            .catch(err => {
                console.log(err);
            });
    };

    executeCommandMqtt = command => {
        let cmd = command + '(low)';
        let eventstr = 'msg(moveRobot,dispatch,js,robotexecutor,usercmd(robotgui( ' + cmd + ')),1)';
        console.log('emits> ' + eventstr);
        this.clientMqtt.publish(MQTT_TOPIC, eventstr);
        /* this.setState({
            command: COMMAND_MAPPING[command]
        }); */
    };

    updateResourceModel = () => {
        const path = API_PATH + '/resource/model';
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${getToken()}`);

        fetch(path, {
            method: 'GET',
            headers: headers
        })
            .then(result => {
                if (result.status === 200) {
                    return result.json();
                } else {
                    this.setState({
                        message: {
                            isLoading: false,
                            value: 'Error on loading resource model',
                            type: 'danger',
                            show: true
                        }
                    });
                }
            })
            .then(result => {
                this.setState({
                    isLoading: false,
                    resourceModel: result.resourceModel,
                    message: {
                        value: '',
                        type: 'success',
                        show: false
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    getMapFromServer = () => {
        const path = API_PATH + '/map';
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${getToken()}`);

        fetch(path, {
            method: 'GET',
            headers: headers
        })
            .then(result => {
                if (result.status === 200) {
                    return result.json();
                } else {
                    return {
                        error: true,
                        errorPromise: result.json()
                    }
                }
            })
            .then(result => {
                this.setState({map: result.map});
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { isLoading, resourceModel, message, map } = this.state;
        return (
            <div className="main-wrapper" tabIndex={0} onKeyDown={this.handleKeyDown}>
                <div className={'gui-wrapper'}>
                    <h2>
                        Welcome back <span className="uc-first">{this.props.userData.username}</span>
                    </h2>
                    <hr />
                    {message.show ? <Alert type={message.type} value={message.value} dismissable={true} /> : ''}

                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="content-wrapper">
                            <div className="row justify-content-center my-2 mt-5">
                                <div className="col-4">
                                    <button
                                        type="button"
                                        name="w"
                                        className="btn btn-success btn-block"
                                        onClick={event => this.handleButtonClicked(event, 'w')}
                                    >
                                        Forward
                                    </button>
                                </div>
                            </div>
                            <div className="row justify-content-center my-2">
                                <div className="col-4">
                                    <button
                                        type="button"
                                        name="a"
                                        className="btn btn-success btn-block"
                                        onClick={event => this.handleButtonClicked(event, 'a')}
                                    >
                                        Left
                                    </button>
                                </div>
                                <div className="col-4">
                                    <button type="button" name="h" className="btn btn-danger btn-block" onClick={event => this.handleButtonClicked(event, 'h')}>
                                        Stop
                                    </button>
                                </div>
                                <div className="col-4">
                                    <button
                                        type="button"
                                        name="d"
                                        className="btn btn-success btn-block"
                                        onClick={event => this.handleButtonClicked(event, 'd')}
                                    >
                                        Right
                                    </button>
                                </div>
                            </div>
                            <div className="row justify-content-center my-2">
                                <div className="col-4">
                                    <button
                                        type="button"
                                        name="s"
                                        className="btn btn-success btn-block"
                                        onClick={event => this.handleButtonClicked(event, 's')}
                                    >
                                        Backward
                                    </button>
                                </div>
                            </div>
                            <div className="row justify-content-center my-2">
                                <div className="col-12">
                                    <button
                                        type="button"
                                        name="x"
                                        className="btn btn-outline-info btn-block"
                                        onClick={event => this.handleButtonClicked(event, 'auto')}
                                    >
                                        Allow autopilot
                                    </button>
                                </div>
                            </div>
                            {map ? <Map map={map} /> : ''}
                            <ResourceModel resourceModel={resourceModel} userCity={this.props.userData.city} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Gui;
