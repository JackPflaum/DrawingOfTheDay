import { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";


const ForgotPassword = () => {
    const [ email, setEmail ] = useState('');

    // ForgotPassword component messages
    const [ errorLocal, setErrorLocal ] = useState('');
    const [ message, setMessage ] = useState('');

    // clears the local error messages after 3 seconds
    const clearLocalError = () => {
        setTimeout(() => {
            setErrorLocal('');
        }, 3000);
    }

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorLocal('Email field is required.');
            clearLocalError();
            return;
        }

        // confirm email exists in database
        const emailExists = await confirmEmailExists(email)

        if (!emailExists) {
            setErrorLocal('User with this email does not exist.');
            clearLocalError();
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
        <div className="container d-flex justify-content-center align-items-center">
            <div className="col-lg-6">
                <div className="card mt-5">
                    <div className="card-body">
                        <h3 className="text-center mb-4">Reset Password</h3>
                        <p className="text-center">Please enter your email address and we will send you an email to reset your password.</p>
                        {message && <p className="success-message d-flex align-items-center"><GrStatusGood />{message}</p>}
                        <Form.Control
                            type="text"
                            value={email}
                            name="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)} />
                        {errorLocal && <p className="error-message d-flex align-items-center"><MdErrorOutline />{errorLocal}</p>}
                        <Button variant="primary mt-2" onClick={handleForgotPassword}>Send Email</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;