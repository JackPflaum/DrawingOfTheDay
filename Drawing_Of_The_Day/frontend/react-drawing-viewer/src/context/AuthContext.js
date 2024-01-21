import { createContext, useContext, useState, useEffect } from 'react';
import { axiosResponseInstance } from '../api/axiosResponseInstance';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [ user, setUser ] = useState(null);
    const [ error, setError ] = useState('')

    // check if the user is authenticated when the component mounts
    useEffect(() => {
        const checkAuthenticationStatus = async () => {
            try {
                const response = await axiosResponseInstance.get('http://localhost:8000/api/check-auth/')
                
                // if the user is authenticated on the backend then response will be true
                if (response.data.user) {
                    setUser(true)
                } else {
                    setUser(false)
                }
            } catch (error) {
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

            const response = await axiosResponseInstance.post('http://localhost:8000/api/token/', loginData);

            // Rest Framework SimpleJWT returns access token and it's saved to HttpOnly, Secure, and SameSite cookie for greater security.
            // HttpOnly means the cookie is inaccessible to Javascript and therefore, reducing XSS attacks.
            // Secure means the cookie is only sent over HTTPS if true
            // SameSite=Strict means the cookie is only sent to the server if the request originates from the site that set the cookie (mitigates CSRF attacks).
            // path defines where on the server the cookie is valid.
            const accessToken = response.data.access;
            Cookies.set('accessToken', accessToken, { httpOnly: true, secure: secureAttribute, sameSite: 'Strict', path: '/' });

            const refreshToken = response.data.refresh;
            Cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: secureAttribute, sameSite: 'Strict', path: '/' });

            setUser(true);

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
    

    const logout = async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            const accessToken = Cookies.get('accessToken');

            // logout on the server
            await axiosResponseInstance.post('http://localhost:8000/api/logout/', { refreshToken },
            { headers: {
                Authorization: `Bearer ${accessToken}`
            }});

            // remove tokens from browser cookie
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });

            setUser(null);

            return true;
        } catch (error) {
            console.error('Logout Failed: ', error);
            throw new Error('Logout Failed');
        }
    };
    

    const isAuthorized = () => {
        return !!user; // true if the user is authenticated, false otherwise
    };


    const clearErrorMessage = () => {
        setError('');
    };


    const contextValues = {
        login,
        logout,
        isAuthorized,
        clearErrorMessage,
        error,
        setError,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);