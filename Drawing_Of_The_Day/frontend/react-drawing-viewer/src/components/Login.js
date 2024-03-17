import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Form, Button } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";


const Login = () => {
    const { login, error, clearErrorMessage } = useAuthContext();
    const [ loginData, setLoginData ] = useState({
        username: '',
        password: '',
    });

    // Login component error messages
    const [ errorLocal, setErrorLocal ] = useState('');

    // page redirection initialisation
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check if both fields are filled in
        if (!loginData.username || !loginData.password) {
            setErrorLocal('All fields are required!');
            return;
        };

        try {
            // call login() function from AuthContext
            await login(loginData);

            // clear AuthContext error once logged in
            clearErrorMessage();

            // redirect to home page after successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed: ', error);
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 ">
                    <h3 className="text-center">Login</h3>
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
                        {error && <p className="error-message">{error}</p>}
                        {errorLocal && <p className="error-message d-flex align-items-center"><MdErrorOutline />{errorLocal}</p>}
                        <div>
                            <NavLink to="/forgot-password">Forgot password?</NavLink>
                        </div>
                        <Button type="submit" variant="primary mt-2">Login</Button>
                    </Form>
                    <div className="d-flex flex-column">
                        <NavLink to="/signup">Signup here</NavLink>
                    </div>  
                </div>
            </div>
        </div>
    );
};

export default Login;