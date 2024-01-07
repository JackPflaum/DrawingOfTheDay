import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '.components/Header';
import ImagesGrid from '.components/Images';

const HomeContent = () => {

    const [ data, setData ] = useState({
        date: '',
        imagePrompt: '',
        imagesList: [],
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
    }

    // initiate data fetching of image prompt and images when HomeContent component mounts.
    useEffect(() => {
        fetchData(data.date, 'latest');
    }, []);

    const handleOrderChange = (e) => {
        const orderOption = e.target.value;
        fetchdata(data.date, orderOption);
    };

    const handleDateChange = (e) => {
        const date = e.target.date;
        fetchData(date, 'latest');
    };

    return(
        <>
            <Header date={data.date} imagePrompt={data.imagePrompt} />
            
            <select name="orderOptions" onChange={handleOrderChange}>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
            </select>
            <input type="date" name="date" value={data.date} onChange={handleDateChange} />
            <Images imagesList={data.imagesList} />
        </>
    );
};

export default HomeContent;