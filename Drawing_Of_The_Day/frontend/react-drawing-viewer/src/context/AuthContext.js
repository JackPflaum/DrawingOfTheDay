import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosRequestInstance from '../api/axiosRequestInstance';
import Cookies from 'js-cookie';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [ user, setUser ] = useState(null);
    const [ error, setError ] = useState('')

    // check if the user is authenticated when the component mounts and set user details
    useEffect(() => {
        const checkAuthenticationStatus = async () => {
            try {
                // check if user has valid access token for authentication
                const accessToken = Cookies.get('accessToken');
                const response = await axiosRequestInstance.get('http://localhost:8000/api/check-auth/', 
                    {headers: {Authorization: `Bearer ${accessToken}`}});

                // set user details from returned data
                const username = response.data.username;
                setUser(username);
                
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Unable to refresh access token');
                }
                console.log('Error: ', error);
                // access and refresh token not valid, therefore the user needs to re-authenticate by logging in
                setUser(null);
            }
        };

        // call function to check authentication status
        checkAuthenticationStatus();
    }, []);


    const login = async ( loginData ) => {
        try {
            // true if in production and false if in development
            const secureAttribute = process.env.NODE_ENV === 'production';

            // make POST request to authenticate user credentials and receive authentication tokens
            const response = await axios.post('http://localhost:8000/api/token/', loginData);

            // Rest Framework SimpleJWT returns access token and it's saved to HttpOnly, Secure, and SameSite cookie for greater security.
            // HttpOnly means the cookie is inaccessible to Javascript and therefore, reducing XSS attacks (if true then can't set cookie)
            // Secure means the cookie is only sent over HTTPS if true
            // SameSite=Strict means the cookie is only sent to the server if the request originates from the site that set the cookie (mitigates CSRF attacks).
            // path defines where on the server the cookie is valid.
            const accessToken = response.data.access;
            Cookies.set('accessToken', accessToken, {secure: secureAttribute, sameSite: 'Strict', path: '/' });

            const refreshToken = response.data.refresh;
            Cookies.set('refreshToken', refreshToken, {secure: secureAttribute, sameSite: 'Strict', path: '/' });

            // deconstruct username from loginData and set to user
            const { username } = loginData;
            setUser(username);

        } catch (error) {
            // if server side error message set error, otherwise set generic error message
            if (error.response && error.response.status === 400) {
                setError('User not found. Please check your credentials.');
            } else {
                setError('Login Failed. Please try again.');   
            }
            throw new Error('Login Failed. Please try again.');    
        }
    };


    const clearErrorMessage = () => {
        setError('');
    };


    const contextValues = {
        login: login,
        user: user,
        setUser: setUser,
        clearErrorMessage: clearErrorMessage,
        error: error,
        setError: setError,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);