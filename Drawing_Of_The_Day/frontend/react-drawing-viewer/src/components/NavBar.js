import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoIosLogIn, IoIosLogOut } from 'react-icons/io';
import { IoPersonAddOutline, IoPersonOutline } from "react-icons/io5";


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


    // full page reload when user clicks navbar logo or Home link
    const handlePageRefresh = () => {
        navigate('/');
        window.location.reload();
    };


    return (
        // navbar with authorization links only showing under certain logged in conditions
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <NavLink to="/" className="navbar-brand nav-heading" onClick={handlePageRefresh}>
                    <img src="paint_brush_logo.png" width="40" height="40" className="d-inline-block rounded-circle me-2" alt="logo"></img>
                    Drawing Of The Day
                </NavLink>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarToggler">
                    <ul className="navbar-nav ml-auto">
                        {links.map((link) => {
                            return (
                                <li key={link.text} className="nav-item me-1">
                                    <NavLink to={link.path}
                                    className="nav-link" 
                                    onClick={link.text === 'Home' ? handlePageRefresh : null}>
                                        {link.text}
                                    </NavLink>
                                </li>
                            )})
                        }
                        { user ? (
                            // if user is logged in then show logout button and profile link
                            <>
                                <li className="nav-item">
                                    <NavLink onClick={handleLogout} className="nav-link me-1">
                                        <IoIosLogOut className="me-1" />
                                        Logout
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={`/profile/${user.userId}`} className="nav-link">
                                        <IoPersonOutline className="me-1" />
                                        Profile
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            // if user is not logged in then show login and signup links
                            <>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link me-1">
                                        <IoIosLogIn className="me-1" />
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signup" className="nav-link">
                                        <IoPersonAddOutline className="me-1" />
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