import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Header from './Header';
import Images from './Images';
import UploadModal from './UploadModal';
import MessageModal from './MessageModal';
import { format } from 'date-fns';
import { useAuthContext } from '../context/AuthContext';
import { Button, Form, Alert } from 'react-bootstrap';


const HomeContent = ({ alertMessage}) => {
    // for handling opening and closing of Upload Image modal
    const [ modalShow, setModalShow ] = useState(false);
    const handleShow = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    // for handling opening and closing of Message Modal
    const defaultMessage = 'You can only upload a drawing for today\'s current text prompt.';
    const [ openMessageModal, setOpenMessageModal ] = useState(false);
    const [ message, setMessage ] = useState(defaultMessage);
    const handleMessageOpen = () => setOpenMessageModal(true);
    const handleMessageClose = () => {setOpenMessageModal(false); setMessage(defaultMessage);};

    // extract user to determine if they are authorized
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

    // adds newly uploaded image to imagesList
    const handleUploadSuccess = (newImage) => {
        setData((prevData) => ({
            ...prevData,
            imagesList: [newImage, ...prevData.imagesList],
        }));
    }

    const openUploadModal = () => {
        // open upload modal if user logged in or tell user to login first
        if (user) {
            setModalShow(true);
        } else {
            setMessage('Login first to upload an image.');
            setOpenMessageModal(true);
        }
    };


    return (
        <div className="container">
            { alertMessage && (
                <Alert key="success" variant="success" dismissible>
                    {alertMessage}
                </Alert>
            )}

            { data.date && data.imagePrompt ? (
                <Header date={data.date} imagePrompt={data.imagePrompt} />
            ) : (
                <h4 className="text-center mt-5">Loading...</h4>
            )}
            <div className="d-flex justify-content-between">
                { data.date === formattedDate ? (
                    <Button variant="primary" onClick={openUploadModal}>Upload Drawing</Button>
                ) : (
                    <Button variant="primary" onClick={handleMessageOpen}>Upload Drawing</Button>
                )}
                { modalShow && <UploadModal modalShow={modalShow} handleClose={handleClose} handleUploadSuccess={handleUploadSuccess} />}
                
                {/* Message Modal: for when users not logged in or try upload on a date other than today */}
                { openMessageModal && <MessageModal
                                        openMessageModal={openMessageModal}
                                        handleMessageClose={handleMessageClose}
                                        message={message}/>}

                <div className="d-flex col-lg-4 col-md-4">
                    <Form.Select name="orderOptions" className="me-1" onChange={handleOrderChange}>
                        <option value="-upload_date">Latest</option>
                        <option value="upload_date">Oldest</option>
                    </Form.Select>
                    <Form.Control type="date" name="date" value={data.date} onChange={handleDateChange} />
                </div>

            </div>
            { data.imagesList.length > 0 ? (
                <Images imagesList={data.imagesList} />
            ) : (
                <h4 className="text-center mt-5">No drawings have been submitted.</h4>
            )}
        </div>
    );
};

export default HomeContent;