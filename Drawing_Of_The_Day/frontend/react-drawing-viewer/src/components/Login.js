import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Modal, Form, Button } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";


const Login = ({ showLoginModal, handleCloseLogin, handleOpenSignup }) => {
    const { login, error, clearErrorMessage } = useAuthContext();
    const [ loginData, setLoginData ] = useState({
        username: '',
        password: '',
    });

    // Login component error messages
    const [ errorLocal, setErrorLocal ] = useState('');

    // clears the local error messages after 3 seconds
    const clearLocalError = () => {
        setTimeout(() => {
            setErrorLocal('');
        }, 3000);
    }

    // page redirection initialisation
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check if both fields are filled in
        if (!loginData.username || !loginData.password) {
            setErrorLocal('All fields are required!');
            clearLocalError();
            return;
        };

        try {
            // call login() function from AuthContext
            await login(loginData);

            // clear AuthContext error once logged in
            clearErrorMessage();

            // close login modal
            handleCloseLogin();

            // redirect to home page after successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed: ', error);
        }
    };

    return (
        <Modal show={showLoginModal} onHide={handleCloseLogin}>
            <Modal.Header closeButton>
                <h2 className="text-center">Login</h2>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={loginData.username}
                            name="username"
                            placeholder="Enter your username"
                            onChange={(e) => setLoginData({...loginData, username: e.target.value})} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={loginData.password}
                            name="password"
                            placeholder="Enter your password"
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                    </Form.Group>
                    {error && <p className="error-message"><MdErrorOutline />{error}</p>}
                    {errorLocal && <p className="error-message d-flex align-items-center"><MdErrorOutline />{errorLocal}</p>}
                    <div>
                        <NavLink to="/forgot-password" onClick={handleCloseLogin}>Forgot password?</NavLink>
                    </div>
                    <Button type="submit" variant="primary mt-2">Login</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                Don't have an account?
                <NavLink onClick={() => {handleCloseLogin(); handleOpenSignup();}}>
                    Signup here
                </NavLink>
            </Modal.Footer>
        </Modal>
    );
};

export default Login;