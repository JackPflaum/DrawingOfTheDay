// Response interceptor for API calls
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const navigate = useNavigate();

const axiosInstance = axios.create({
    base_URL: 'http://localhost:8000/',
});


// interceptor to check if access token has expired based on server response
axiosInstance.interceptors.response.use(

    // async function takes response object as its parameter and returns the original HTTP response from the server without modification
    async (response) => {
        return response;
    },

    // if response contains error then axios error callback is triggered. Attempt to refresh access token and retry original request
    async (error) => {

        // config contains the original request configuration/information
        const originalRequest = error.config;

        // check if token has expired based on response status 401 (unauthorized) and if the request has been retried
        if (error.response.status === 401 && !originalRequest._retry) {
            // set to true to prevent further attempts at refreshing token
            originalRequest._retry = true;

            // attempt to refresh access token
            try {
                const refreshToken = Cookies.get('refreshToken');
                const response = await axiosInstance.post('api/token/refresh/', refreshToken);

                // get access token from response
                const newAccessToken = response.data.access;

                // store token in cookie
                const secureAttribute = process.env.NODE_ENV === 'production';  // true if in production and false if in development
                Cookies.set('accessToken', newAccessToken, {httpOnly: true, secure: secureAttribute , sameSite: 'Strict', path: '/'});

                // update original Authorization header with new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // retry original request with new access token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshtoken);
                navigate('login');
            }
        }
    // propagates error downstream so error can be handled in other parts of the application
    return Promise.reject(error);
    };
);

export default axiosInstance;







// Request interceptor for API calls
axiosInstance.js

import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const navigate = useNavigate();

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

// interceptor to check if access token has expired before request is sent
axiosInstance.interceptors.request.use(
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
                    const response = await axios.post(/api/token/refresh', refreshToken);

                    // get access token from axios response
                    const accessToken = response.data.access;

                    // store token in cookie
                    const secureAttribute = process.env.NODE_ENV === 'production';  // true if in production and false if in development
                    Cookies.set('accessToken', accessToken, {httpOnly: true, secure: secureAttribute, sameSite: 'Strict', path: '/' });

                    // attach new access token to request header
                    config.headers.Authorization = `Bearer ${accessToken}`;
                } catch (error) {
                    // unable to refresh the access token
                    // return to login screen
                    console.error('Error refreshing token: ', error);
                    navigate('login');
                }

            } else {
                // access token is still valid and can be attached to request header
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

export default axiosInstance;