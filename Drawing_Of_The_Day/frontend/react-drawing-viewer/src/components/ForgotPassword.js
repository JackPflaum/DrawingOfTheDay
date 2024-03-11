import { useState } from 'react';
import axios from 'axios';
import '../css/GeneralStyling.css';


const ForgotPassword = () => {
    const [ email, setEmail ] = useState('');

    // ForgotPassword component messages
    const [ errorLocal, setErrorLocal ] = useState('');
    const [ message, setMessage ] = useState('');

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorLocal('Email field is required.');
            return;
        }

        // confirm email exists in database
        const emailExists = await confirmEmailExists(email)

        if (!emailExists) {
            setErrorLocal('User with this email does not exist.')
            return;
        }

        try {
            console.log('requesting reset link');
            // request password reset link to specified email
            const response = await axios.post('http://localhost:8000/api/password_reset/', { email });

            // get success response and tell user to check email
            if (response.status === 200) {
                setMessage('We have sent an email with instructions on how to reset your password.');
                setErrorLocal('');
            }
        } catch (error) {
            setErrorLocal('An error occured. Please try again.');
            console.log('Error: ', error);
        }
    };


    // confirming user email exists in database
    const confirmEmailExists = async ( email ) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/confirm_email_exists/?email=${email}`);
            return true;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                return false;
            } else {
                return false;
            }
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <h2>Reset Password</h2>
                <p>Please enter your email address and we will send you an email to reset your password.</p>
                { message && <p className="success-message">{message}</p>}
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