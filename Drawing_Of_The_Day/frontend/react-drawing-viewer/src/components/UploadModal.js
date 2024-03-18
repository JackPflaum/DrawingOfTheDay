import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axiosResponseInstance from '../api/axiosResponseInstance';
import '../css/UploadModal.css';
import Cookies from 'js-cookie';
import { Modal, Button, Form } from 'react-bootstrap';
import { MdErrorOutline } from "react-icons/md";


const UploadModal = ({ modalShow, handleClose, handleUploadSuccess }) => {
    const [ imageFile, setImageFile ] = useState(null);
    const navigate = useNavigate();

    // UploadModal error messages
    const [ localError, setLocalError ] = useState();
  
    const handleImageUpload = async () => {
        //check if image has been selected
        if(!imageFile) {
            setLocalError('Please select an image before you click upload!');
            return;
        };
    
        // post image to backend
        try {
            // create new formData object and append uploaded image to it.
            const formData = new FormData();
            formData.append('imageFile', imageFile);

            const accessToken = Cookies.get('accessToken');
            const response = await axiosResponseInstance.post(
                'http://localhost:8000/upload-image/',
                formData,
                {headers: {
                    'Content-Type': 'multipart/form-data',    // specifies the type of data that is sent in the request body.
                    Authorization: `Bearer ${accessToken}`}});

            console.log('upload axios response: ',response.data);

            // set image state and error messages back to null
            setImageFile(null);
            setLocalError();

            // triggers update of imagesList in HomeContent component
            handleUploadSuccess(response.data.newImageData);

            // close modal
            handleClose();        
        } catch (error) {
            // first if block: axiosResponseInstance had an error when refreshing token
            if (error.response && error.response.status === 401) {
                console.log(error.response);
                setLocalError('Sorry, you need to be logged in to upload a drawing.');
                navigate('/login');
            } else if (error.response && error.response.status === 400) {
                console.log(error.response);
                setLocalError('Image size exceeds the allowable limit of 5MB');
            } else if (error.response && error.response.status === 404) {
                console.log(error.response);
                setLocalError('Sorry, you can\'t upload a drawing since there is no drawing prompt yet.');
            } else if (error.response && error.response.status === 409) {
                console.log(error.response);
                setLocalError('Sorry, you can only submit one drawing per day.');
            } else if (error.response && error.response.status === 500) {
                console.error(error.response);
                setLocalError('Sorry, there has been an internal server error. Please try again.');
            } else {
                console.error('Error uploading image file: ', error);
            }
        };
    }
  
    const handleFileChange = (e) => {
        const selectedImageFile = e.target.files[0];

        // check file size
        const maxSizeInBytes = 5 * 1024 * 1024;    // 5MB
        if (selectedImageFile.size > maxSizeInBytes) {
            setLocalError('Image size exceeds the allowable limit of 5MB');
            setImageFile(null);
            return;
        }
        
        // set selected file
        setImageFile(selectedImageFile);
        setLocalError(null);
    };
  
    return (
        <Modal show={modalShow} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h2>Upload Drawing</h2>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label className="pb-2">Choose an image:</Form.Label>
                    <Form.Control type="file" name="image" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                </Form.Group>
                {localError && <p className="error-message d-flex align-items-center"><MdErrorOutline />{localError}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleImageUpload}>Upload Image</Button>
            </Modal.Footer>
        </Modal>
    );
};


UploadModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
}


export default UploadModal;