import { Modal, Button } from 'react-bootstrap';

const MessageModal = ({ openMessageModal, handleMessageClose, message }) => {

    return (
        <Modal show={openMessageModal} onHide={handleMessageClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h2>Upload Drawing</h2>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleMessageClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MessageModal;