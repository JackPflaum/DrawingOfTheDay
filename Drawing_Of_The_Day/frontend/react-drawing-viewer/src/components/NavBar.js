import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';


const NavBar = () => {

    const { user, setUser } = useAuthContext();

    const navigate = useNavigate();

    const links = [
        {path: '/', text: 'Home'},
    ];

    const handleLogout = async () => {
        // handle user logout by invalidating refresh token on server side
        try {
            const refreshToken = Cookies.get('refreshToken');

            // make POST request to log out and blacklist refresh token
            await axios.post('http://localhost:8000/api/logout/', {refresh: refreshToken});

            // remove tokens from browser cookie
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });

            // set user authContext to null meaning user is logged out
            setUser(null);
            
            // redirect to home page after successful logout
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Logout Failed: User already logged out')
            } else {
                console.error('Logout Error: ', error.message);
            }
        }
    };

    return (
        // navbar with authorization links only showing under certain logged in conditions
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <NavLink to="/" className="navbar-brand">
                    Drawing Of The Day
                </NavLink>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        {links.map((link) => {
                            return (
                                <li key={link.text} className="nav-item">
                                    <NavLink to={link.path} className="nav-link">
                                        {link.text}
                                    </NavLink>
                                </li>
                            )})
                        }
                        { user ? (
                            // if user is logged in then show logout button and profile link
                            <>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="nav-link btn btn-secondary">
                                        Logout
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/profile" className="nav-link">
                                        Profile
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            // if user is not logged in then show login and signup links
                            <>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link btn btn-primary">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signup" className="nav-link btn btn-primary">
                                        Signup
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
    
export default NavBar;