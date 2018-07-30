import React, {Component} from 'react';
import '../components-styles/console.css';
import mqtt from 'mqtt';
import { getToken } from '../utils/localStorageUtils';
import config from '../config/config';

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
            robotStatus: {
                obstacle: '',
                sonar1: false,
                sonar2: false,
            },
            temperature: null,
            command: false,
        };

        this.clientMqtt = mqtt.connect(MQTT_HOST);
        this.clientMqtt.on('connect', () => {
            this.clientMqtt.subscribe(MQTT_TOPIC);
        });

        this.temperatureInterval = null;

        this.handleButtonClicked = this.handleButtonClicked.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.temperatureCheck = this.temperatureCheck.bind(this);
    }

    componentDidMount() {
        this.clientMqtt.on('message', (topic, payload, packet) => {
            //console.log(topic, payload.toString(), packet);
            this.setState({
                robotStatus: getRobotMessage(payload.toString(), this.state.robotStatus)
            })
        });

        this.temperatureCheck();
        this.temperatureInterval = setInterval(
            () => this.temperatureCheck(), 30000); // 30 seconds
    }

    componentWillUnmount() {
        clearInterval(this.temperatureInterval);
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

    handleKeyDown = (event) => {
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

        this.setState({
            robotStatus: {
                obstacle: '',
                sonar1: false,
                sonar2: false,
            }
        });

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

    temperatureCheck = () => {
        const path = API_PATH + '/weather/temperature/' + this.props.userData.city;
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
                this.setState({
                    temperature: result.temperature + '°'
                })
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { robotStatus } = this.state;
        return (
            <div tabIndex={0} onKeyDown={this.handleKeyDown}>
                <div className={'gui-wrapper'}>
                    <h2>Welcome back <span className="uc-first">{this.props.userData.username}</span></h2>
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
                            <li><b>Current temperature in <span className="uc-first">{this.props.userData.city}</span>: </b>
                                {this.state.temperature}
                            </li>
                            <li><b>Robot status:</b>
                                <ul>
                                    <li><b>Obstacle: </b> {robotStatus.obstacle}</li>
                                    <li><b>Sonar 1: </b> {robotStatus.sonar1 ? 'distance = ' + robotStatus.sonar1 : '' }</li>
                                    <li><b>Sonar 2: </b> {robotStatus.sonar2 ? 'distance = ' + robotStatus.sonar2 : '' }</li>
                                </ul>
                            </li>
                            {this.state.command ?
                                <li><b>Latest command: </b> {this.state.command}</li> : ''
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Gui;

const getRobotMessage = (message, robotStatus) => {
    let robotMessage = message.split('(');
    if (message.indexOf('sonarDetect') !== -1) {
        // find obstacle
        robotMessage = robotMessage[2].split(')');
        robotStatus.obstacle = robotMessage[0];
    } else if (message.indexOf('sonar') !== -1) {
        // sonar message
        robotMessage = robotMessage[2].split(')')[0];
        robotMessage = robotMessage.split(',');
        let sonar = robotMessage[0];
        if (sonar == 'sonar1') {
            robotStatus.sonar1 = robotMessage[2];
        }
        if (sonar == 'sonar2') {
            robotStatus.sonar2 = robotMessage[2];
        }
    }
    return robotStatus;
};

