import React, { useState, useRef } from 'react';

const ImageModal = () => {
    const [openModal, setOpenModal ] = useState(false);

    return (
        <div ref={ref}>
            <img src={} alt={} />
        </div>
    );

};

export default ImageModal;