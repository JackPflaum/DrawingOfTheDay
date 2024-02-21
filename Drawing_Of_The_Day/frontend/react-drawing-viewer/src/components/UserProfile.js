import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Images from './Images';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [ imagesList, setImagesList ] = useState();
    const [ username, setUsername ] = useState();

    // get users previously uploaded images when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // get images from backend
                const response = await axios.get(`http://localhost:8000/api/profile/${userId}`);

                // set images
                const images = response.data.images;
                setImagesList(images);

                // set username
                const username = response.data.username;
                setUsername(username);
            } catch (error) {
                // navigate back to home page if error occurs
                console.log('error: ', error);
                navigate('/');
            }
        };
        fetchData();
    }, [userId]);

    return (
        <div>
            <h4 className="text-center mt-3">{username}</h4>
            { imagesList ? (<Images imagesList={imagesList} />) : (
                <p className="text-center">You have not uploaded any drawings.</p>
            )}
        </div>
    );
};

export default UserProfile;