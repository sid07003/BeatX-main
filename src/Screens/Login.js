import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SCSS/Login.scss';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const loginData = {
            "email": email,
            "password": password
        }

        // fetch()
    };

    return (
        <div className="container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <Link to={"/Signup"} id="create_new_account">Create New Account</Link>
                </form>
            </div>
        </div>
    );
}
