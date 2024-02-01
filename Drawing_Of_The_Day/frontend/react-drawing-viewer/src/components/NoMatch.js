import { NavLink } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";

const NoMatch = () => {
    return (
        <div className="container">
            <div className="row text-center pt-5">
                <h1>Oops!</h1>
                <h2>404 Page Not Found!</h2>
                <div className="">
                    Sorry, an error has occured
                </div>
                <div className="mt-2">
                    <NavLink to="/" className="btn btn-primary"><IoHomeOutline /> Home</NavLink>
                </div>
            </div>
        </div>
    );
};

export default NoMatch;