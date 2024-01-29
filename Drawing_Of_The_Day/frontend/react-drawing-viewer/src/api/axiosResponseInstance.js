// Response interceptor for API calls
import axios from 'axios';
import Cookies from 'js-cookie';


const axiosResponseInstance = axios.create({
    baseURL: 'http://localhost:8000/',
});


// interceptor to check if access token has expired based on server response
axiosResponseInstance.interceptors.response.use(

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
                console.log('attempt refresh');
                const refreshToken = Cookies.get('refreshToken');

                const response = await axios.post('http://localhost:8000/api/token/refresh/', {refresh: refreshToken});
                console.log('refresh returned');

                // get access token from response
                const newAccessToken = response.data.access;

                // store token in cookie
                const secureAttribute = process.env.NODE_ENV === 'production';  // true if in production and false if in development
                Cookies.set('accessToken', newAccessToken, {secure: secureAttribute , sameSite: 'Strict', path: '/'});

                // update original Authorization header with new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // retry original request with new access token
                return axiosResponseInstance(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                window.location.href = 'login/';
            }
        }
    // propagates error downstream so error can be handled in other parts of the application
    return Promise.reject(error);
    }
);

export default axiosResponseInstance;