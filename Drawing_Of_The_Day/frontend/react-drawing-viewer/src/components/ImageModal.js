import '../css/ImageModal.css';

const ImageModal = ({isOpen, closeModal, ref, imageUrl, username, imagePrompt}) => {

    return (
        <div>
        { isOpen && <div className="modal-backdrop"></div>}
        <div ref={ref} className="modal-content">
            <div className="d-flex justify-content-between">
                <h3>{imagePrompt}</h3>
                <span onClick={closeModal}>&times;</span>
            </div>
            <img src={`http://localhost:8000/${imageUrl}`} ></img>
            <p>{username}</p>
            <div className="d-flex pt-3">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
        </div>
    </div>
    );

};

export default ImageModal;