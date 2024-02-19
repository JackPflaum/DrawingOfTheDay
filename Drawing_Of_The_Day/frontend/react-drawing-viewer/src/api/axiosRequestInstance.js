// Request interceptor for API calls
import axios from 'axios';
import Cookies from 'js-cookie';


const axiosRequestInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

// interceptor to check if access token has expired before request is sent
axiosRequestInstance.interceptors.request.use(
    async (config) => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            // checking if access token has expired
            const expirationTime = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000;
            const currentTime = new Date().getTime();

            if (currentTime >= expirationTime) {
                try {
                    // access token has expired, and therefore we will try to refresh it
                    const refreshToken = Cookies.get('refreshToken');
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });

                    // get access token from axios response
                    const accessToken = response.data.access;

                    // store token in cookie
                    const secureAttribute = process.env.NODE_ENV === 'production';  // true if in production and false if in development
                    Cookies.set('accessToken', accessToken, {secure: secureAttribute, sameSite: 'Strict', path: '/' });

                    // attach new access token to request header
                    config.headers.Authorization = `Bearer ${accessToken}`;
                } catch (refreshError) {
                    // unable to refresh the access token
                    console.error('Error refreshing token:', refreshError);
                    throw {status: 401, message: 'Unable to refresh access token'};
                }

            } else {
                // access token is still valid and can be attached to request header
                console.log('access token not expired');
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    // callback error is triggered if config has errors
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosRequestInstance;