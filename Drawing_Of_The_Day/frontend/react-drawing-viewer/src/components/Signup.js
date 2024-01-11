import { NavLink, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [ signupData, setSignupData ] = useState({
        email: '',
        username: '',
        password1: '',
        password2: '',
    });

    const [ error, setError ] = useState('');

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (!signupData.email || !signupData.username || !signupData.password2 || !signupData.password2) {
            setError('All fields are required!');
            return;
        };

        if (!signupData.password1 !== signupData.password2 ) {
            setError('Passwords do not match!');
            return;
        };

        try {
            const response = await axios.post('http://localhost:8000/signup', signupData);

            const accessToken = response.data.access;
            localStorage.setItem('accessToken', accessToken);

            useNavigate('/');
        } catch (error) {
           console.error('Signup failed: ', erorr);
        }
    };

    return (
        <div className="container">
            <h3>Signup</h3>
            <form onSubmit={handleSignupSubmit}>
                <label>Email:</label>
                <input
                    type="text"
                    value={signupData.email}
                    name="email"
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                <label>Username:</label>
                <input
                    type="text"
                    value={signupData.username}
                    name="username"
                    onChange={(e) => setSignupData({...signupData, username: e.target.value})} />
                <label>Password:</label>
                <input
                    type="text"
                    value={signupData.password1}
                    name="password1"
                    onChange={(e) => setSignupData({...signupData, password1: e.target.value})} />
                <label>Password:</label>
                <input
                    type="text"
                    value={signupData.password2}
                    name="password2"
                    onChange={(e) => setSignupData({...signupData, password2: e.target.value})} />
                <button type="submit">Signup</button>
            </form>
            {error && <p>{error}</p>}
            <NavLink to="/login">Already registered? Login here</NavLink>
        </div>
    );
};

export default Signup;