import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/ImageModal.css';
import { saveAs } from 'file-saver';
import { BsDownload } from "react-icons/bs";

const ImageModal = ({ showModal, closeModal, imageUrl, username, imagePrompt, date }) => {

  // allows user to download drawing
  const handleDownloadDrawing = () => {
    try {
      //using file-saver package to download image file
      saveAs(`http://localhost:8000/${imageUrl}`, `drawing-${date}.jpg`);
    } catch (error) {
      console.error('Error downloading drawing:', error);
    }
  }


  return (
    <Modal show={showModal} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">
          {date}: {imagePrompt}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{display: "flex", justifyContent: "center"}}>
        <div>
          <img src={`http://localhost:8000/${imageUrl}`} alt="modal-img" className="img-fluid" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>Close</Button>
        <Button variant="primary" onClick={handleDownloadDrawing}>Download Drawing <BsDownload/></Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;