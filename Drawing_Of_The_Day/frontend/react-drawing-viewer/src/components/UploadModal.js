import React, { useState } from 'react';

const UploadModal = ({ isOpen, closeModal }) => {
    const [ imageFile, setImageFile ] = useState(null);
  
    const handleImageUpload = async () => {
        //check if image has been selected
        if(!imageFile) {
            console.error('No image selected');
            return;
        };
    
        // post image to backend
        try {
            const formData = new FormData();
            formData.append('imageFile', imageFile);

            const response = await axios.post('http://localhost:8000/upload-image', formData);
            console.log(response.data);
            setImageFile(null);
            closeModal();
        
        } catch (error) {
            console.error('Error uploading image file: ', error);
        }
    };
  
    const handleFileChange = (e) => {
        const selectedImageFile = e.target.files[0];
        setImageFile(selectedImageFile);
    };
  
    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <div className="d-flex justify-content-between">
                    <h3>Upload Drawing</h3>
                    <span onClick={closeModal}>&times;</span>
                </div>
                <label>Choose an image:</label>
                <input type="file" name="image" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button className="btn btn-primary" onClick={handleImageUpload}>Upload Image</button>
            </div>
        </div>
    );
};

export default UploadModal;