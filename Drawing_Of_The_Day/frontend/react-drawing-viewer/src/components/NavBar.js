import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const NavBar = () => {

    const { isAuthorized, setUser } = useAuthContext();  

    let navigate = useNavigate();

    const links = [
        {path: '/', text: 'Home', requiresAuthorization: false},
        {path: '/login', text: 'Login', requiresAuthorization: false},
        {path: '/logout', text: 'Logout', requiresAuthorization: true},
        {path: '/signup', text: 'Signup', requiresAuthorization: false},
    ];

    const handleLogout = async () => {
        // handle user logout by invalidating refresh token on server side
        try {
            const refreshToken = Cookies.get('refreshToken');

            // make POST request to log out and blacklist refresh token
            const response = await axios.post('http://localhost:8000/api/logout/', {refresh: refreshToken});

            // remove tokens from browser cookie
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });

            // set user authContext to false meaning user is logged out
            setUser(false);
            
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
                                { link.text === 'Logout' ? 
                                    (
                                        <NavLink onClick={handleLogout} className="nav-link btn btn-secondary">{link.text}</NavLink>
                                    ) : (
                                        <NavLink to={link.path} className="nav-link">{link.text}</NavLink>
                                    )
                                }
                            </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>


        // navbar with authorization links only showing under certain logged in conditions
        // <nav className="navbar navbar-expand-lg navbar-light bg-light">
        // <div className="container">
        //     <NavLink to="/" className="navbar-brand">
        //         Drawing Of The Day
        //     </NavLink>
        //     <div className="collapse navbar-collapse">
        //         <ul className="navbar-nav ml-auto">
        //             {links.map((link) => {
        //                 // Conditionally render links based on authentication status and requiresAuthorization property
        //                 if (link.requiresAuthorization) {
        //                     // Display only when logged in
        //                     if (isAuthorized()) {
        //                         return (
        //                             <li key={link.text} className="nav-item">
        //                                 <NavLink onClick={handleLogout} className="nav-link btn btn-secondary">
        //                                     {link.text}
        //                                 </NavLink>
        //                             </li>
        //                         );
        //                     }
        //                 } else {
        //                     // Display when not logged in
        //                     if (!isAuthorized()) {
        //                         return (
        //                             <li key={link.text} className="nav-item">
        //                                 <NavLink to={link.path} className="nav-link">
        //                                     {link.text}
        //                                 </NavLink>
        //                             </li>
        //                         );
        //                     }
        //                     // Display always
        //                     return (
        //                         <li key={link.text} className="nav-item">
        //                             <NavLink to={link.path} className="nav-link">
        //                                 {link.text}
        //                             </NavLink>
        //                         </li>
        //                     );
        //                 }
        //                 return null; // Render nothing if the condition is not met
        //             })}
        //         </ul>
        //     </div>
        // </div>
        // </nav>
    );
};
    
export default NavBar;