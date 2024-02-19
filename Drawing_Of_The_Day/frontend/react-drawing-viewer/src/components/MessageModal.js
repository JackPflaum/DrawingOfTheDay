import '../css/UploadModal.css';

const MessageModal = ({ isOpen, closeModal, ref }) => {

    return (
        <div>
            { isOpen && <div className="modal-backdrop"></div>}
            <div ref={ref} className="modal-content">
                <div className="d-flex justify-content-between">
                    <h3>Upload Drawing</h3>
                    <span onClick={closeModal}>&times;</span>
                </div>
                <p>You can only upload a drawing for today's current text prompt.</p>
                <div className="d-flex align-items-center justify-content-end pt-3">
                    <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;