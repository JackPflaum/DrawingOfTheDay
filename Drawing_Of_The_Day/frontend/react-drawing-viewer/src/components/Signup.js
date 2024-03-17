import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Form, Button } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";


const Signup = () => {
    const [ signupData, setSignupData ] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
    });

    let navigate = useNavigate();

    const [ localError, setLocalError ] = useState('');

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (!signupData.email || !signupData.username || !signupData.password2 || !signupData.password2) {
            setLocalError('All fields are required!');
            return;
        };

        if (signupData.password1 !== signupData.password2 ) {
            setLocalError('Passwords do not match!');
            return;
        };

        try {
            // true if in production and false if in development
            const secureAttribute = process.env.NODE_ENV === 'production';

            const response = await axios.post('http://localhost:8000/api/signup/', { signupData });

            const accessToken = response.data.access;
            Cookies.set('accessToken', accessToken, { httpOnly: true, secure: secureAttribute, sameSite: 'Strict', path: '/' });

            const refreshToken = response.data.refresh;
            Cookies.set('RefreshToken', refreshToken, { httpOnly: true, secure: secureAttribute, sameSite: 'Strict', path: '/'});

            navigate('/');
        } catch (error) {
            if (error && error.response.status === 400) {
                setLocalError(error.response.data.error);
            } else if (error && error.response.status === 500) {
                console.error('Signup failed: ', error);
                setLocalError(error);
            }
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6">
                    <h3 className="text-center">Signup</h3>
                    <Form onSubmit={handleSignupSubmit}>
                        <Form.Group>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="text"
                                value={signupData.email}
                                name="email"
                                placeholder="Enter your email"
                                onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                value={signupData.username}
                                name="username"
                                placeholder="Enter your username"
                                onChange={(e) => setSignupData({...signupData, username: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={signupData.password1}
                                name="password1"
                                placeholder="Enter your password"
                                onChange={(e) => setSignupData({...signupData, password1: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={signupData.password2}
                                name="password2"
                                placeholder="Confirm your password"
                                onChange={(e) => setSignupData({...signupData, password2: e.target.value})} />
                        </Form.Group>
                        {localError && <p className="error-message d-flex align-items-center"><MdErrorOutline />{localError}</p>}
                        <Button type="submit" variant="primary mt-2">Signup</Button>
                    </Form>
                    <NavLink to="/login" className="mt-2">Already registered? Login here</NavLink>
                </div>
            </div>           
        </div>
    );
};

export default Signup;