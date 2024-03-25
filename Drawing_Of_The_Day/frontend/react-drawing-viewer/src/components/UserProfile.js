import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Images from './Images';
import { Button, Modal, Alert } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";
import { useAuthContext } from '../context/AuthContext';
import axiosRequestInstance from '../api/axiosRequestInstance';
import Cookies from 'js-cookie';

const UserProfile = ({ showAlertMessage }) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [ imagesList, setImagesList ] = useState();
    const [ username, setUsername ] = useState();

    // user holds authorized user data
    const { user, setUser } = useAuthContext();

    // delete account modal
    const [ showModal, setShowModal ] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // error messages for profile page
    const [ localError, setLocalError ] = useState('');

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


    // handle the deletion of a users account
    const handleDeleteAccount = async () => {
        try {
            // delete user in django backend
            const response = await axiosRequestInstance.delete('http://localhost:8000/api/delete-account/',
                {data: {user_id: userId}});

            // successful user deletion response
            const successMessage = response.data.success;
            showAlertMessage(successMessage);
            console.log('success message: ', successMessage);

            // remove tokens from browser cookie
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });

            // set user authContext to null meaning user is logged out
            setUser(null);

            // navigate to home page
            navigate('/');

        } catch (error) {
            console.log('Error: ', error.reponse)
            setLocalError('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="container">
            <h4 className="text-center mt-3">{username}</h4>

            {/* delete account button only for owner of profile */}
            { user && user.username === username && (
                <Button onClick={handleOpenModal} variant="danger">Delete Account</Button>
            ) }

            {/* delete account modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2>Delete Account</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete your account? All your uploaded drawings will be permanently deleted.
                </Modal.Body>
                <Modal.Footer>
                    {localError && <p className="error-message d-flex align-items-center"><MdErrorOutline />{localError}</p>}
                    <Button onClick={handleCloseModal} variant="secondary">Close</Button>
                    <Button onClick={handleDeleteAccount} variant="primary">Delete Account</Button>
                </Modal.Footer>
            </Modal>

            {/* User images displayed here */}
            { imagesList ? (<Images imagesList={imagesList} />) : (
                <h5 className="text-center mt-5">No drawings have beem uploaded yet.</h5>
            )}
        </div>
    );
};

export default UserProfile;