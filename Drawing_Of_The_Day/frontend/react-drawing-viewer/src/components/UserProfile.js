import { useState, useEffect } from 'react';
import axios from 'axios';
import Images from './Images';

const UserProfile = () => {

    const [ imagesList, setImagesList ] = useState();

    // get users previous images when component mounts
    useEffect(async () => {
        try {
            // get images from backend
            const response = await axios.get('http://localhost:8000/profile/');

            // set images 
            setImagesList(response.data);
        } catch (error) {
            console.log('error: ', error);
        }
    }, []);
    return (
        <div>
            <h4>Profile Page</h4>
            <Images imagesList={imagesList} />
        </div>
    );
};

export default UserProfile;