import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Signup = () => {
    const [ signupData, setSignupData ] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
    });

    const navigate = useNavigate();

    const [ error, setError ] = useState('');

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (!signupData.email || !signupData.username || !signupData.password2 || !signupData.password2) {
            setError('All fields are required!');
            return;
        };

        if (!signupData.password1 != signupData.password2 ) {
            setError('Passwords do not match!');
            return;
        };

        try {
            const response = await axios.post('http://localhost:8000/signup', signupData);

            const accessToken = response.data.access;
            Cookies.set('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

            const refreshToken = response.data.refresh;
            Cookies.set('RefreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/'});

            navigate('/');
        } catch (error) {
           console.error('Signup failed: ', error);
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6">
                    <h3 className="text-center">Signup</h3>
                    <form onSubmit={handleSignupSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={signupData.email}
                                name="email"
                                placeholder="Enter your email"
                                onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={signupData.username}
                                name="username"
                                placeholder="Enter your username"
                                onChange={(e) => setSignupData({...signupData, username: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={signupData.password1}
                                name="password1"
                                placeholder="Enter your password"
                                onChange={(e) => setSignupData({...signupData, password1: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={signupData.password2}
                                name="password2"
                                placeholder="Confirm your password"
                                onChange={(e) => setSignupData({...signupData, password2: e.target.value})} />
                        </div>
                        <button type="submit">Signup</button>
                    </form>
                </div>
            </div>
            {error && <p>{error}</p>}
            <NavLink to="/login">Already registered? Login here</NavLink>
        </div>
    );
};

export default Signup;