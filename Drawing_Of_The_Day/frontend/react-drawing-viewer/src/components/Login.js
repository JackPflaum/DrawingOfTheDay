import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [ loginData, setLoginData ] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/token/', loginData);

            // API returns access token and it's saved to local storage for future requests
            const accessToken = response.data.access;
            localStorage.setItem('accessToken', accessToken);

            // redirect to home page
            useNavigate('/');

        } catch (error) {
            console.error('Login failed: ', error);
        }
    };

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="text"
                    value={loginData.email}
                    name="email" 
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
                <label>Password:</label>
                <input
                    type="text"
                    value={loginData.password}
                    name="password"
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <NavLink to="/forgot-password">Forgot password?</NavLink>
            <NavLink to="/signup">Signup here</NavLink>
        </div>
    );
};

export default Login;