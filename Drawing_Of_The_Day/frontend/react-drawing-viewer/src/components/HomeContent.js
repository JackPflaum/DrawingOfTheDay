import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import Header from './Header';
import Images from './Images';
import UploadModal from './UploadModal';
import MessageModal from './MessageModal';
import { useOnClickOutside } from '../hooks/customHooks';
import { format } from 'date-fns';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const HomeContent = () => {
    // for opening up Upload Image modal
    const [ openModal, setOpenModal ] = useState(false);

    // for opening up Message Modal
    const [ openMessageModal, setOpenMessageModal ] = useState(false);
    const ref = useRef();

    // for redirecting user
    const navigate = useNavigate();

    const { user } = useAuthContext();

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

            console.log('Home Component Fetching data');
            // 'await' keyword pauses the execution of the function until axios.get promise is resolved.
            const response = await axios.get(`http://localhost:8000/home/?date=${formattedDateForBackend}&order_option=${orderOption}`);

            console.log('Home Component data returned properly');

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
        // redirect user to login page if user is not logged in
        if (user) {
            setOpenModal(true);
        } else {
            navigate('/login');
        }
    };

    const closeUploadModal = () => {
        setOpenModal(false);
    };

    // when the user mouseclicks outside an open modal it calls custom hook to close the modal.
    useOnClickOutside(ref, openModal, () => setOpenModal(false));

    return (
        <div className={openModal ? "container backdrop" : "container"}>
            { data.date && data.imagePrompt ? (
                <Header date={data.date} imagePrompt={data.imagePrompt} />
            ) : (
                <p className="text-center mt-5">Loading...</p>
            )}
            <div className="d-flex justify-content-between">
                { data.date === formattedDate ? (
                    <button className="btn btn-primary" onClick={openUploadModal}>Upload Drawing</button>
                ) : (
                    <button className="btn btn-primary" onClick={() => setOpenMessageModal(true)}>Upload Drawing</button>
                )}
                { openModal && <UploadModal ref={ref} isOpen={openModal} closeModal={closeUploadModal} />}

                {/* Message Modal: for when users try upload on a date other than today */}
                { openMessageModal && <MessageModal ref={ref} isOpen={openMessageModal} closeModal={() => setOpenMessageModal(false)} />}

                <div className="d-flex">
                    <select name="orderOptions" className="me-2" onChange={handleOrderChange}>
                        <option value="-upload_date">Latest</option>
                        <option value="upload_date">Oldest</option>
                    </select>
                    <input type="date" name="date" className="pr-4" value={data.date} onChange={handleDateChange} />
                </div>

            </div>
            { data.imagesList.length > 0 ? (
                <Images imagesList={data.imagesList} />
            ) : (
                <h3 className="text-center">No drawings have been submitted.</h3>
            )}
        </div>
    );
};

export default HomeContent;