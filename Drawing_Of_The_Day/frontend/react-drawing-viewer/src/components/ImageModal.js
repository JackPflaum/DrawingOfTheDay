import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/ImageModal.css';
import { saveAs } from 'file-saver';

const ImageModal = ({ showModal, closeModal, imageUrl, username, imagePrompt, date }) => {

  // allows user to download drawing
  const handleDownloadDrawing = () => {
    saveAs(`http://localhost:8000/${imageUrl}`, `drawing-${date}.jpg`);
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
        <Button variant="primary" onClick={handleDownloadDrawing}>Download Drawing</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;