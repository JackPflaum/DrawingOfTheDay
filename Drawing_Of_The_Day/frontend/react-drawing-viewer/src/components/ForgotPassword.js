import { useState } from 'react';
import axios from 'axios';


const ForgotPassword = () => {
    const [ email, setEmail ] = useState('');

    // ForgotPassword component error messages
    const [ errorLocal, setErrorLocal ] = useState('');

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorLocal('Email field is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/password-reset/', { email: email });

            // get response and tell user to check email
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <h2>Reset Password</h2>
                <p>Please enter your email address and we will send you an email to reset your password.</p>
                <input
                    type="text"
                    className=""
                    value={email}
                    name="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)} />
                    { errorLocal && <p className="error-message">{errorLocal}</p>}
                <button className="btn btn-primary" onClick={handleForgotPassword}>Send Email</button>
            </div>
        </div>
    );
};

export default ForgotPassword;