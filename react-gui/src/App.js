import React, {Component} from 'react';
import logo from './logo.svg';
import Console from './components/Console';
import Login from './components/Login';
import Register from './components/Register';
import Loading from './components/Loading';
import Profile from './components/Profile';
import {validateRequiredInput} from "./utils/validation";
import { setToken, getToken, removeToken } from './utils/localStorageUtils';
import config from './config/config';

const APPLICATION_API_HOST = config.serverHost;
const API_HEADERS = new Headers();
API_HEADERS.append('Accept', 'application/json');
API_HEADERS.append('Content-Type', 'application/json');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'FuffaTeam',
            isLoading: false,
            userLogged: false,
            username: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            password: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            newPassword: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            confirmPassword: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            city: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            currentPage: 'home'
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
        this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const field = this.state[name];
        field.value = event.target.value;
        this.setState(field);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        let hasErrors = false;
        let usernameValidation = validateRequiredInput(username, username.value);
        if (usernameValidation.hasError) {
            hasErrors = true;
        }
        let passwordValidation = validateRequiredInput(password, password.value);
        if (passwordValidation.hasError) {
            hasErrors = true;
        }

        if (!hasErrors) {
            // input data for login
            this.loginRequest();
        } else {
            this.setState({
                username: usernameValidation.object,
                password: passwordValidation.object
            })
        }
    };

    loginRequest = () => {
        this.setState({
            isLoading: true
        });
        let path = APPLICATION_API_HOST + '/auth/login';
        const userBody = JSON.stringify({
            user: {
                username: this.state.username.value,
                password: this.state.password.value
            }
        });
        let hasErros = false;
        fetch(path, {
            method: 'POST',
            headers: API_HEADERS,
            body: userBody,
        })
            .then(result => {
                if (result.status === 400) {
                    hasErros = true;
                }
                return result.json();
            })
            .then(result => {
                if (hasErros) {
                    const state = this.state;
                    const errors = result.payload.errors;
                    Object.keys(errors).map(errKey => {
                        const err = errors[errKey];
                        console.log(err);
                        state[err.param].className = 'form-control is-invalid';
                        state[err.param].errorMsg = err.command;
                        state.isLoading = false;

                        this.setState(state);
                    })
                } else {
                    setToken(result.token);
                    this.setState({
                        username: {
                            className: 'form-control',
                            errorMsg: '',
                            value: result.username,
                        },
                        password: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        newPassword: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        confirmPassword: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        city: {
                            className: 'form-control',
                            errorMsg: '',
                            value: result.city,
                        },
                        userLogged: {
                            id: result.userId,
                            username: result.username,
                            city: result.city
                        },
                        isLoading: false,
                        title: 'FuffaTeam - Console'
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleLogoutClick = (event) => {
        event.preventDefault();
        const token = getToken();
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        fetch(APPLICATION_API_HOST + '/users/logout', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    title: 'FuffaTeam',
                    isLoading: false,
                    userLogged: false,
                    userId: '',
                    username: {
                        className: 'form-control',
                        errorMsg: '',
                        value: '',
                    },
                    password: {
                        className: 'form-control',
                        errorMsg: '',
                        value: '',
                    },
                    newPassword: {
                        className: 'form-control',
                        errorMsg: '',
                        value: '',
                    },
                    confirmPassword: {
                        className: 'form-control',
                        errorMsg: '',
                        value: '',
                    },
                    city: {
                        className: 'form-control',
                        errorMsg: '',
                        value: '',
                    },
                    currentPage: 'home'
                });
                removeToken();
            })
            .catch(err => console.log(err));
    };

    handleLinkClick = (event, page) => {
        event.preventDefault();
        const { userLogged, username, city } = this.state;
        let title = 'FuffaTeam';
        if (page !== 'home') {
            title += ' - ' + page[0].toUpperCase() + page.substr(1);
        } else if (page === 'home' && userLogged) {
            title += ' - Console';
        }
        this.setState({
            currentPage: page,
            username: {
                className: 'form-control',
                errorMsg: '',
                value: username.value,
            },
            password: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            newPassword: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            confirmPassword: {
                className: 'form-control',
                errorMsg: '',
                value: '',
            },
            city: {
                className: 'form-control',
                errorMsg: '',
                value: city.value,
            },
            userLogged: userLogged,
            isLoading: false,
            title: title
        })
    };

    handleSubmitRegister = (event) => {
        event.preventDefault();
        const { username, password, confirmPassword, city } = this.state;
        let hasErrors = false;
        let usernameValidation = validateRequiredInput(username, username.value);
        if (usernameValidation.hasError) {
            hasErrors = true;
        }
        let passwordValidation = validateRequiredInput(password, password.value);
        if (passwordValidation.hasError) {
            hasErrors = true;
        }
        let confirmPasswordValidation = validateRequiredInput(confirmPassword, confirmPassword.value);
        if (confirmPasswordValidation.hasError) {
            hasErrors = true;
        }
        let cityValidation = validateRequiredInput(city, city.value);
        if (cityValidation.hasError) {
            hasErrors = true;
        }
        if (!confirmPasswordValidation.hasError && !passwordValidation.hasError) {
            if (confirmPassword.value !== password.value) {
                hasErrors = true;
                passwordValidation.object.className = 'form-control is-invalid';
                passwordValidation.object.errorMsg = 'Password and confirm password must be the same';
                confirmPasswordValidation.object.className = 'form-control is-invalid';
                confirmPasswordValidation.object.errorMsg = 'Password and confirm password must be the same';
            }
        }

        if (!hasErrors) {
            // register request
            this.registerRequest();
        } else {
            this.setState({
                username: usernameValidation.object,
                password: passwordValidation.object,
                confirmPassword: confirmPasswordValidation.object,
                city: cityValidation.object,
            })
        }
    };

    registerRequest = () => {
        this.setState({
            isLoading: true
        });
        let path = APPLICATION_API_HOST + '/public/register';
        const userBody = JSON.stringify({
            user: {
                username: this.state.username.value,
                password: this.state.password.value,
                city: this.state.city.value
            }
        });
        let hasErros = false;
        fetch(path, {
            method: 'POST',
            headers: API_HEADERS,
            body: userBody,
        })
            .then(result => {
                if (result.status === 400) {
                    hasErros = true;
                }
                return result.json();
            })
            .then(result => {
                if (hasErros) {
                    const state = this.state;
                    const errors = result.payload.errors;
                    Object.keys(errors).map(errKey => {
                        const err = errors[errKey];
                        console.log(err);
                        let param = err.param.replace('user.', '');
                        state[param].className = 'form-control is-invalid';
                        state[param].errorMsg = err.command;
                        state.isLoading = false;

                        this.setState(state);
                    })
                } else {
                    setToken(result.token);
                    this.setState({
                        username: {
                            className: 'form-control',
                            errorMsg: '',
                            value: result.user.username,
                        },
                        password: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        newPassword: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        confirmPassword: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        city: {
                            className: 'form-control',
                            errorMsg: '',
                            value: result.user.city,
                        },
                        userLogged: {
                            id: result.user._id.toString(),
                            username: result.user.username,
                            city: result.user.city
                        },
                        isLoading: false,
                        title: 'FuffaTeam - Console',
                        currentPage: 'home'
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleProfileSubmit = (event) => {
        event.preventDefault();
        const { username, newPassword, confirmPassword, city } = this.state;
        let hasErrors = false;
        let usernameValidation = validateRequiredInput(username, username.value);
        if (usernameValidation.hasError) {
            hasErrors = true;
        }
        let cityValidation = validateRequiredInput(city, city.value);
        if (cityValidation.hasError) {
            hasErrors = true;
        }
        if (confirmPassword.value !== newPassword.value) {
            hasErrors = true;
            newPassword.className = 'form-control is-invalid';
            newPassword.errorMsg = 'New password and confirm password must be the same';
            confirmPassword.className = 'form-control is-invalid';
            confirmPassword.errorMsg = 'New password and confirm password must be the same';
        }

        if (!hasErrors) {
            // register request
            this.profileUpdateRequest();
        } else {
            this.setState({
                username: usernameValidation.object,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
                city: cityValidation.object,
            })
        }
    };

    profileUpdateRequest = () => {
        if (!this.state.userLogged) {
            return;
        }
        this.setState({
            isLoading: true
        });
        let path = APPLICATION_API_HOST + '/users/' + this.state.userLogged.id;
        const userBody = JSON.stringify({
            user: {
                username: this.state.username.value,
                oldPassword: this.state.password.value,
                newPassword: this.state.newPassword.value,
                city: this.state.city.value
            }
        });
        let hasErros = false;
        const token = getToken();
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        fetch(path, {
            method: 'PUT',
            headers: headers,
            body: userBody,
        })
            .then(result => {
                if (result.status === 400) {
                    hasErros = true;
                }
                return result.json();
            })
            .then(result => {
                if (hasErros) {
                    const state = this.state;
                    const errors = result.payload.errors;
                    Object.keys(errors).map(errKey => {
                        const err = errors[errKey];
                        err.param = err.param.replace('user.', '');
                        let stateKey = (err.param === 'oldPassword' ? 'password' : err.param);
                        console.log(err);
                        state[stateKey].className = 'form-control is-invalid';
                        state[stateKey].errorMsg = err.command;
                        state.isLoading = false;

                        this.setState(state);
                    })
                } else {
                    this.setState({
                        username: {
                            className: 'form-control',
                            errorMsg: '',
                            value: result.user.username,
                        },
                        password: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        newPassword: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        confirmPassword: {
                            className: 'form-control',
                            errorMsg: '',
                            value: '',
                        },
                        city: {
                            className: 'form-control',
                            errorMsg: '',
                            value: result.user.city,
                        },
                        userLogged: {
                            id: result.user._id.toString(),
                            username: result.user.username,
                            city: result.user.city
                        },
                        isLoading: false,
                        title: 'FuffaTeam - Console',
                        currentPage: 'home'
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { currentPage, userLogged } = this.state;
        let content = <Login
            username={this.state.username}
            password={this.state.password}
            handleChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            handleLinkClick={this.handleLinkClick}
        />;
        if (currentPage === 'home') {
            content = <Login
                username={this.state.username}
                password={this.state.password}
                handleChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleLinkClick={this.handleLinkClick}
            />;
            if (userLogged) {
                content = <Console userData={this.state.userLogged}/>
            }
        } else if (currentPage === 'register' && !userLogged) {
            content = <Register
                username={this.state.username}
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                city={this.state.city}
                handleSubmit={this.handleSubmitRegister}
                handleChange={this.handleInputChange}
                handleLinkClick={this.handleLinkClick}
            />
        } else if (currentPage === 'profile' && userLogged) {
            content = <Profile
                userLogged={this.state.userLogged}
                username={this.state.username}
                password={this.state.password}
                newPassword={this.state.newPassword}
                confirmPassword={this.state.confirmPassword}
                city={this.state.city}
                handleSubmit={this.handleProfileSubmit}
                handleChange={this.handleInputChange}
            />
        }

        return (
            <div className="App">
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <a className="navbar-brand" href="/" onClick={event => this.handleLinkClick(event, 'home')}>
                            <img src={logo} width="30" height="30" className="d-inline-block align-top app-logo" alt=""/>
                            {this.state.title}
                        </a>
                        {this.state.userLogged ?
                            <ul className="navbar-nav mr-auto mt-2 mt-md-0">
                                <li className="nav-item">
                                    <a className="nav-link" href="/profile" onClick={event => this.handleLinkClick(event, 'profile')}>Profile <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/logout" onClick={this.handleLogoutClick}>Logout <span className="sr-only">(current)</span></a>
                                </li>
                            </ul>
                            : ''}

                    </div>
                </nav>
                <div className="app-wrapper">
                    <div className={'container'}>
                        {this.state.isLoading ? <Loading/> : content}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
