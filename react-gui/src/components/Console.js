import React, {Component} from 'react';
import '../components-styles/console.css';
import mqtt from 'mqtt';
import { getToken } from '../utils/localStorageUtils';

const API_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const API_PATH = 'http://localhost:5000/robot/command/';

const MQTT_HOST = 'ws://localhost:1884';
//const MQTT_HOST = 'ws://192.168.2.24:1884';
//const MQTT_HOST = 'ws://192.168.1.253:1884';
const MQTT_TOPIC = 'unibo/qasys';

const KEY_BIND = {
    87: 'w',
    65: 'a',
    68: 'd',
    83: 's',
    72: 'h'
};

const COMMAND_MAPPING = {
    'w': 'Forward',
    'a': 'Left',
    'd': 'Right',
    's': 'Backward',
    'h': 'Stop'
};

const useMqtt = false;

class Gui extends Component {
    constructor(props) {
        super(props);
        this.state = {
            robotStatus: false,
            command: false,
        };

        this.clientMqtt = mqtt.connect(MQTT_HOST);
        this.clientMqtt.on('connect', () => {
            this.clientMqtt.subscribe(MQTT_TOPIC);
        });

        this.handleButtonClicked = this.handleButtonClicked.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        this.clientMqtt.on('message', (topic, payload, packet) => {
            //console.log(topic, payload.toString(), packet);
            this.setState({
                robotStatus: getRobotMessage(payload.toString())
            })
        })
    }

    handleButtonClicked = (event, command) => {
        event.preventDefault();
        let path = API_PATH + command;

        if (useMqtt) {
            this.executeCommandMqtt(command);
        } else {
            this.executeCommandHttp(path, command);
        }

    };

    handleKeyDown = (event) => {
        event.preventDefault();

        let command = KEY_BIND[event.keyCode];

        if (command) {
            let path = API_PATH + command;

            if (useMqtt) {
                this.executeCommandMqtt(command);
            } else {
                this.executeCommandHttp(path);
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

                this.setState({
                    command: COMMAND_MAPPING[command]
                })
            })
            .catch(err => {
                console.log(err);
            });
    };

    executeCommandMqtt = (command) => {

        let cmd = command + '(low)';
        let eventstr = 'msg(moveRobot,dispatch,js,robotexecutor,usercmd(robotgui( ' + cmd + ')),1)';
        console.log("emits> " + eventstr);
        this.clientMqtt.publish(MQTT_TOPIC, eventstr);
        this.setState({
            command: COMMAND_MAPPING[command]
        });
    };

    render() {
        return (
            <div tabIndex={0} onKeyDown={this.handleKeyDown}>
                <div className={'gui-wrapper'}>
                    <h2>Welcome back {this.props.username}</h2>
                    <hr />
                    <div className="row justify-content-center my-2 mt-5">
                        <div className="col-4">
                            <button type="button" name="w" className="btn btn-success btn-block"
                                    onClick={(event) => this.handleButtonClicked(event, 'w')}>Forward
                            </button>
                        </div>
                    </div>
                    <div className="row justify-content-center my-2">
                        <div className="col-4">
                            <button type="button" name="a" className="btn btn-success btn-block"
                                    onClick={(event) => this.handleButtonClicked(event, 'a')}>Left
                            </button>
                        </div>
                        <div className="col-4">
                            <button type="button" name="h" className="btn btn-danger btn-block"
                                    onClick={(event) => this.handleButtonClicked(event, 'h')}>Stop
                            </button>
                        </div>
                        <div className="col-4">
                            <button type="button" name="d" className="btn btn-success btn-block"
                                    onClick={(event) => this.handleButtonClicked(event, 'd')}>Right
                            </button>
                        </div>
                    </div>
                    <div className="row justify-content-center my-2">
                        <div className="col-4">
                            <button type="button" name="s" className="btn btn-success btn-block"
                                    onClick={(event) => this.handleButtonClicked(event, 's')}>Backward
                            </button>
                        </div>
                    </div>
                    <div className="row justify-content-center my-2">
                        <div className="col-12">
                            <button type="button" name="x" className="btn btn-outline-info btn-block"
                                    onClick={(event) => this.handleButtonClicked(event, 'x')}>Allow autopilot
                            </button>
                        </div>
                    </div>
                    <div className={'robot-status'}>
                        <ul>
                            {this.state.command ?
                                <li><b>Latest command:</b> {this.state.command}</li> : ''
                            }
                            {this.state.robotStatus ?
                                <li><b>Latest robot message:</b> {this.state.robotStatus}</li> : ''
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Gui;

const getRobotMessage = (message) => {
    let robotMessage = message.split('(');
    if (message.indexOf('moveRobot') !== -1) {
        robotMessage = robotMessage[2];
        console.log(robotMessage);
    } else {
        robotMessage = robotMessage[2].split(')');
    }
    return robotMessage;
};

