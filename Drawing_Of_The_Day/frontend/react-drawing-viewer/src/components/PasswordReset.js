import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const PasswordReset = () => {
    // extract token query parameter from of the URL
    const { token } = useParams();

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
            const response = await axios.post('http://localhost:8000/api/password_reset/confirm/', 
                {token: token, password: password1}
            );

            // handle success response
            console.log('Password reset successful:', response.data);

            // navigate back to login so user can log in with new password
            navigate('/login')
        } catch (error) {
            // handle error response
            console.log('Password reset error: ', error.message);
            setErrorLocal('An error occured. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <h2>Change Your Password</h2>
                <input
                    type="password"
                    className=""
                    value={password1}
                    name="password1"
                    placeholder="Enter new password"
                    onChange={(e) => setPassword1(e.target.value)} />
                <input
                    type="password"
                    className=""
                    value={password2}
                    name="password2"
                    placeholder="Confirm new password"
                    onChange={(e) => setPassword2(e.target.value)} />
                    { errorLocal && <p className="error-message">{errorLocal}</p>}
                <button className="btn btn-primary" onClick={handlePasswordReset}>Reset Password</button>
            </div>
        </div>
    );
};

export default PasswordReset;