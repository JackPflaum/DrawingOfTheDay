import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [ user, setUser ] = useState(null);

    // check if the user is authenticated when the component mounts
    useEffect(() => {
        const checkAuthenticationStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8000/check-auth/')
                
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
            const response = await axios.post('http://localhost:8000/token/', loginData);

            // Rest Framework SimpleJWT returns access token and it's saved to HttpOnly, Secure, and SameSite cookie for greater security.
            // HttpOnly means the cookie is inaccessible to Javascript and therefore, reducing XSS attacks.
            // Secure means the cookie is only sent over HTTPS.
            // SameSite=Strict means the cookie is only sent to the server if the request originates from the site that set the cookie (mitigates CSRF attacks).
            // path defines where on the server the cookie is valid.
            const accessToken = response.data.access;
            Cookies.set('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

            const refreshToken = response.data.refresh;
            Cookies.set('RefreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

            setUser(true);

        } catch (error) {
            console.error('Login Failed: ', error);
            throw new Error('Login Failed');
        }
    };
    

    const logout = async () => {
        try {
            const refreshToken = Cookies.get('RefreshToken');

            // logout on the server
            await axios.post('http://localhost:8000/logout/', { refreshToken });

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

    const contextValues = {
        login,
        logout,
        isAuthorized,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);