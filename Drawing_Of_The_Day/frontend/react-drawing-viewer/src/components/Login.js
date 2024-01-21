import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

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
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={loginData.email}
                                name="username"
                                placeholder="Enter your email"
                                onChange={(e) => setLoginData({...loginData, username: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={loginData.password}
                                name="password"
                                placeholder="Enter your password"
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                    {error && <p>{error}</p>}
                    {errorLocal && <p>{errorLocal}</p>}
                    <NavLink to="/forgot-password" className="text-decoration-none">Forgot password?</NavLink>
                    <NavLink to="/signup">Signup here</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Login;