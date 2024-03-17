import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";


// create new user password
const PasswordReset = () => {
    // extract reset token query parameter from of the URL
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const navigate = useNavigate();

    const [ password1, setPassword1 ] = useState('');
    const [ password2, setPassword2 ] = useState('');

    // PasswordReset component error messages
    const [ errorLocal, setErrorLocal ] = useState('');

    const handlePasswordReset = async () => {
        if (!password1 || !password2) {
            setErrorLocal('Both password fields are required.');
            return;
        }

        if (password1 !== password2) {
            setErrorLocal('Passwords do not match.');
            return;
        }

        try {
            // post new password change using django_rest_passwordreset package
            const response = await axios.post('http://localhost:8000/api/password_reset/confirm/',
                {token: token, password: password1}
            );

            // handle success response
            console.log('Password reset successful:', response.data);

            // navigate back to login so user can log in with new password
            navigate('/login')
        } catch (error) {
            // handle error response
            console.log('Password reset error: ', error.response);
            setErrorLocal('An error occured. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6">
                    <h3 className="text-center">Change Your Password</h3>
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                        type="password"
                        value={password1}
                        name="password1"
                        placeholder="Enter new password"
                        onChange={(e) => setPassword1(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                        type="password"
                        value={password2}
                        name="password2"
                        placeholder="Confirm new password"
                        onChange={(e) => setPassword2(e.target.value)} />
                        { errorLocal && <p className="error-message d-flex align-items-center"><MdErrorOutline />{errorLocal}</p>}
                    </Form.Group>
                    <Button variant="primary mt-2" onClick={handlePasswordReset}>Reset Password</Button>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;