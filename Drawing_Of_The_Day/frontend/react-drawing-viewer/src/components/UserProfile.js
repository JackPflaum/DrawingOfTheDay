import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosResponseInterceptor from '../api/axiosResponseInstance';
import Cookies from 'js-cookie';
import Images from './Images';
import { useAuthContext } from '../context/AuthContext';

const UserProfile = () => {

    const navigate = useNavigate();
    const [ imagesList, setImagesList ] = useState();
    const { user } = useAuthContext();

    // get users previously uploaded images when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // get images from backend
                const access = Cookies.get('accessToken');
                const response = await axiosResponseInterceptor.get(
                    'http://localhost:8000/api/profile/', {
                        headers: {Authorization: `Bearer ${access}`}
                    });

                // set images
                const images = response.data.images
                setImagesList(images);
            } catch (error) {
                // navigate back to home page if error occurs
                console.log('error: ', error);
                navigate('/');
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h4 className="text-center">{user}'s Profile Page</h4>
            { imagesList ? (<Images imagesList={imagesList} />) : (
                <p className="text-center">You have not uploaded any drawings.</p>
            )}
        </div>
    );
};

export default UserProfile;