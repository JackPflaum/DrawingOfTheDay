import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [ loginData, setLoginData ] = useState({
        email: '',
        password: '',
    });

    const [ error, setError ] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!loginData.email || !loginData.password) {
                setError('All fields are required!');
                return;
            };

            const response = await axios.post('http://localhost:8000/token/', loginData);

            // API returns access token and it's saved to HttpOnly, Secure, and SameSite cookie for greater security.
            // HttpOnly means the cookie is inaccessible to Javascript and therefore, reducing XSS attacks.
            // Secure means the cookie is only sent over HTTPS.
            // SameSite=Strict means the cookie is only sent to the server if the request originates from the site that set the cookie (mitigates CSRF attacks).
            const accessToken = response.data.access;
            document.cookie = `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict`;

            // redirect to home page
            navigate('/');

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
            {error && <p>{error}</p>}
            <NavLink to="/forgot-password">Forgot password?</NavLink>
            <NavLink to="/signup">Signup here</NavLink>
        </div>
    );
};

export default Login;