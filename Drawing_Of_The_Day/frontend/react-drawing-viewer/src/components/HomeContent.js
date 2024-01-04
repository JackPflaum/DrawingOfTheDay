import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '.components/Header';
import ImagesGrid from '.components/ImagesGrid';

const HomeContent = () => {

    const [ data, setData ] = useState({
        date: '',
        imagePrompt: '',
        imagesList: [],
    });

    // initiate data fetching of image prompt and images.
    useEffect(() => {
        // 'async' keyword specifies that this is an asynchronous function that will return a promise (enables the use of 'await').
        const fetchData = async () => {
            try {
                // 'await' keyword pauses the execution of the function until axios.get promise is resolved.
                const response = await axios.get('http://localhost:8000/home/');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();  //calls fetchData function when HomeContent component mounts
    }, []);

    return(
        <>
            <Header date={data.date} imagePrompt={data.imagePrompt} />
            <ImagesGrid imagesList={data.imagesList} />
        </>
    );
};

export default HomeContent;