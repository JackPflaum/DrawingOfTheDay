import { NavLink } from 'react-router-dom';

const links = [
    {path: '/', text: 'Home'},
    {path: '/login', text: 'Login'},
    {path: '/logout', text: 'Logout'},
];

const NavBar = () => {
    return (
        <nav>
            <div className="">
                <div>
                    <img src="" alt="logo" />
                </div>
                <div>
                    <ul>
                        {links.map((link) => {
                            return (
                            <li key={link.text}>
                                <NavLink to={link.path}>{link.text}</NavLink>
                            </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
    
export default NavBar;