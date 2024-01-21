import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './Header';
import Images from './Images';
import UploadModal from './UploadModal';
import { useOnClickOutside } from '../custom-hooks/useOnClickOutside';

const HomeContent = () => {
    const [ openModal, setOpenModal ] = useState(false);
    const ref = useRef();

    const [ data, setData ] = useState({
        date: new Date().toISOString().split('T')[0],  //set inital date to today
        imagePrompt: '',
        imagesList: [],
        orderOption: '-upload_date',
    });

    // 'async' keyword specifies that this is an asynchronous function that will return a promise (enables the use of 'await').
    const fetchData = async (date, orderOption) => {
        try {
            // 'await' keyword pauses the execution of the function until axios.get promise is resolved.
            const response = await axios.get(`http://localhost:8000/home/?date=${date}&order_option=${orderOption}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    // initiate data fetching of image prompt and images when HomeContent component mounts.
    useEffect(() => {
        fetchData(data.date, data.orderOption);
    }, [data.date, data.orderOption]);

    const handleDateChange = (e) => {
        e.preventDefault();
        const date = e.target.value;
        setData((prev) => ({
            ...prev,
            date: date,
        }));
    };

    const handleOrderChange = (e) => {
        e.preventDefault();
        const orderOption = e.target.value;
        setData((prev) => ({
            ...prev,
            orderOption: orderOption,
        }));
    };

    const openUploadModal = () => {
        setOpenModal(true);
    };

    const closeUploadModal = () => {
        setOpenModal(false);
    };

    // when the user mouseclicks outside an open modal it calls custom hook to close the modal.
    useOnClickOutside(ref, openModal, () => setOpenModal(false));

    return (
        <div className={openModal ? "container backdrop" : "container"}>
            <Header date={data.date} imagePrompt={data.imagePrompt} />
            <div className="d-flex justify-content-between">
                <button onClick={openUploadModal}>Upload Drawing</button>
                { openModal && <UploadModal ref={ref} isOpen={openModal} closeModal={closeUploadModal} />}

                <div className="d-inline-flex">
                    <select name="orderOptions" onChange={handleOrderChange}>
                        <option value="-upload_date">Latest</option>
                        <option value="upload_date">Oldest</option>
                    </select>
                    <input type="date" name="date" value={data.date} onChange={handleDateChange} />
                </div>

            </div>
            <Images imagesList={data.imagesList} />
        </div>
    );
};

export default HomeContent;