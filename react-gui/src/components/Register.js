import React from 'react';
import '../components-styles/login.css';

class Register extends React.Component {

    render() {
        const { username, password, confirmPassword, city, handleChange, handleSubmit, handleLinkClick } = this.props;
        return (
            <div className="login-wrapper">
                <h2>Register</h2>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            className={username.className}
                            value={username.value}
                            id="username"
                            name="username"
                            placeholder="Enter username"
                        />
                        <div className="invalid-feedback">
                            {username.errorMsg}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            onChange={handleChange}
                            className={password.className}
                            value={password.value}
                            id="password"
                            name="password"
                            placeholder="Password"
                        />
                        <div className="invalid-feedback">
                            {password.errorMsg}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            type="password"
                            onChange={handleChange}
                            className={confirmPassword.className}
                            value={confirmPassword.value}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm password"
                        />
                        <div className="invalid-feedback">
                            {confirmPassword.errorMsg}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">City</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            className={city.className}
                            value={city.value}
                            id="city"
                            name="city"
                            placeholder="Enter city"
                        />
                        <small id="cityHelp" className="form-text text-muted">Set up which city will be used to check temperature</small>
                        <div className="invalid-feedback">
                            {city.errorMsg}
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </form>
                <hr />
                <p className="text-muted form-help"><a href="/login" onClick={event => handleLinkClick(event, 'home')}>Login</a> if you are already registered</p>
            </div>
        )
    }
}

export default Register;