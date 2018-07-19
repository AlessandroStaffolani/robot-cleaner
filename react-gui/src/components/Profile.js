import React from 'react';
import '../components-styles/login.css';

class Profile extends React.Component {

    render() {
        const { username, password, newPassword, confirmPassword, role, handleChange, handleSubmit, userLogged } = this.props;
        return (
            <div className="login-wrapper">
                <h2>Update profile</h2>
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
                        <label htmlFor="password">Old password</label>
                        <input
                            type="password"
                            onChange={handleChange}
                            className={password.className}
                            value={password.value}
                            id="password"
                            name="password"
                            placeholder="Old password"
                            aria-describedby="oldPasswordHelp"
                        />
                        <small id="oldPasswordHelp" className="form-text text-muted">To change your password you need to insert the old one.</small>
                        <div className="invalid-feedback">
                            {password.errorMsg}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New password</label>
                        <input
                            type="password"
                            onChange={handleChange}
                            className={newPassword.className}
                            value={newPassword.value}
                            id="newPassword"
                            name="newPassword"
                            placeholder="New password"
                        />
                        <div className="invalid-feedback">
                            {newPassword.errorMsg}
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
                    {userLogged.role === 'admin' ?
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <input
                                type="text"
                                onChange={handleChange}
                                className={role.className}
                                value={role.value}
                                id="role"
                                name="role"
                                placeholder="Enter role"
                            />
                            <div className="invalid-feedback">
                                {role.errorMsg}
                            </div>
                        </div>
                        : ''}
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Profile;