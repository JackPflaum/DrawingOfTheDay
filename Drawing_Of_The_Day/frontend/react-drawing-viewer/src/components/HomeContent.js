import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import Header from './Header';
import Images from './Images';
import UploadModal from './UploadModal';
import { useOnClickOutside } from '../hooks/customHooks';
import { format } from 'date-fns';

const HomeContent = () => {
    // for opening up Upload Image modal
    const [ openModal, setOpenModal ] = useState(false);
    const ref = useRef();

    // set intial date to today and use date-fns format function to format the date
    const currentDate = new Date();
    // replace default separator '/' with '-' so it can be sent as a html parameter
    const formattedDate = format(currentDate, 'dd-MM-yyyy');

    const [ data, setData ] = useState({
        date: formattedDate,
        imagePrompt: '',
        imagesList: [],
        orderOption: '-upload_date',
    });

    // 'async' keyword specifies that this is an asynchronous function that will return a promise (enables the use of 'await').
    const fetchData = async (date, orderOption) => {
        try {
            // format date as 'yyyy-MM-dd' because that is how backend requires it.
            const [ day, month, year ] = date.split('-');
            const formattedDateForBackend = format(new Date(`${year}-${month}-${day}`), 'yyyy-MM-dd');

            // 'await' keyword pauses the execution of the function until axios.get promise is resolved.
            const response = await axios.get(`http://localhost:8000/home/?date=${formattedDateForBackend}&order_option=${orderOption}`);

            // convert returned date to 'dd-MM-yyyy'
            const returnedDate = response.data.date;
            const [ returnedYear, returnedMonth, returnedDay ] = returnedDate.split('-');
            const formattedDateForFrontend = `${returnedDay}-${returnedMonth}-${returnedYear}`;
            
            // set the data that was received from api request
            setData({
                date: formattedDateForFrontend,
                imagePrompt: response.data.imagePrompt,
                imagesList: response.data.imagesList,
                orderOption: response.data.orderOption,
            });

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

        // convert date string to an object which allows the date to be formatted in the desired way.
        const dateString = e.target.value;
        const dateObject = new Date(dateString);

        // use date-fns format function to format the date
        const formattedDate = format(dateObject, 'dd-MM-yyyy');
        
        setData((prev) => ({
            ...prev,
            date: formattedDate,
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
                <button className="btn btn-primary" onClick={openUploadModal}>Upload Drawing</button>
                { openModal && <UploadModal ref={ref} isOpen={openModal} closeModal={closeUploadModal} />}

                <div className="d-flex">
                    <select name="orderOptions" className="me-2" onChange={handleOrderChange}>
                        <option value="-upload_date">Latest</option>
                        <option value="upload_date">Oldest</option>
                    </select>
                    <input type="date" name="date" className="pr-4" value={data.date} onChange={handleDateChange} />
                </div>

            </div>
            <Images imagesList={data.imagesList} />
        </div>
    );
};

export default HomeContent;