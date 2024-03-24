import { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Modal, Form, Button } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";


const Signup = ({ showSignupModal, handleCloseSignup, handleOpenLogin }) => {
    const [ signupData, setSignupData ] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
    });

    let navigate = useNavigate();

    const [ localError, setLocalError ] = useState('');

    // clears the local error messages after 3 seconds
    const clearLocalError = () => {
        setTimeout(() => {
            setLocalError('');
        }, 3000);
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (!signupData.email || !signupData.username || !signupData.password2 || !signupData.password2) {
            setLocalError('All fields are required!');
            clearLocalError();
            return;
        };

        if (signupData.password1 !== signupData.password2 ) {
            setLocalError('Passwords do not match!');
            clearLocalError();
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

            // close signup modal
            handleCloseSignup();

            navigate('/');
        } catch (error) {
            if (error && error.response && error.response.status === 400) {
                // extract error string from validation error response:
                // {error: {'email': [ErrorDetail(string='A user is already using this email.', code='invalid')]}}
                const errorMessage = error.response.data.error.match(/string='([^']+)'/)[1];

                setLocalError(errorMessage);

                // clear after 3 seconds
                clearLocalError();
            } else if (error && error.response.status === 500) {
                console.error('Signup failed: ', error);
                setLocalError(error);
                clearLocalError();
            }
        }
    };

    return (
        <Modal show={showSignupModal} onHide={handleCloseSignup}>
            <Modal.Header closeButton>
                <h2 className="text-center">Signup</h2>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                Already registered?
                <NavLink onClick={() => {handleCloseSignup(); handleOpenLogin();}}>
                    Login here
                </NavLink>
            </Modal.Footer>      
        </Modal>
    );
};

export default Signup;