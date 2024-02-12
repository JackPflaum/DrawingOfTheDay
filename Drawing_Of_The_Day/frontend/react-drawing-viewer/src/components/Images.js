import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosRequestInstance from '../api/axiosRequestInstance';
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';
import '../css/images.css';
import { HiOutlineThumbDown, HiOutlineThumbUp, HiThumbDown, HiThumbUp } from "react-icons/hi";


const Images = ({ imagesList }) => {

    const [ imagesState, setImagesState ] = useState([]);
    const { user } = useAuthContext();
    const accessToken = Cookies.get('accessToken');
    const [localError, setLocalError] = useState('');

    const fetchImageLikes = async (imagesList) => {
        console.log('Image Component Image List: ', imagesList);
        if (imagesList && imagesList.length > 0) {
            try {
                const imageIds = imagesList.map((image) => image.id);

                // if user logged in then use axiosRequestInstance to check access token expiry and retrieve previous likes and dislike responces
                if (user) {
                    // get like and dislike data for each image in imageList
                    const response = await axiosRequestInstance.get('http://localhost:8000/image-likes/',
                        { params: { image_ids: imageIds } },
                        {headers: {Authorization: `Bearer ${accessToken}`}});

                    const newImagesState = imagesList.map((image) => {
                        const likesDislikes = response.data.find((item) => item[image.id]);
                        return {...image, 
                            likesDislikes: likesDislikes ? likesDislikes.likes_dislikes_count : {likes: 0, dislikes: 0},
                            like: null};
                    });

                    setImagesState(newImagesState);
                } else {
                    // if user not authorized then normal axios get request
                    const response = await axios.get('http://localhost:8000/image-likes/', { params: { image_ids: imageIds } });
                    const newImagesState = imagesList.map((image) => {
                        const likesDislikes = response.data.find((item) => item[image.id]);
                        return {...image,
                            likesDislikes: likesDislikes ? likesDislikes.likes_dislikes_count : {likes: 0, dislikes: 0},
                            like: null};
                    });

                    console.log('NewImagesState: ', newImagesState);
                    setImagesState(newImagesState);
                }

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Error: ', error);
                } else {
                    console.log('Error fetching image details', error);
                }
            }
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchImageLikes(imagesList);
        }
        fetchData();
        console.log('Image Component, fetching likes complete');
    }, [imagesList]);


    const handleLikeDislike = async (imageId, likeStatus) => {
        if (user) {
            try {
                console.log('handleLikeDislike: start of function.', imageId);

                const response = await axiosRequestInstance.post('http://localhost:8000/like-dislike/', {imageId, likeStatus});
                    
                setImagesState((prevImagesState) => {
                    const newImagesState = prevImagesState.map((image) => {
                        if (image.id === imageId) {
                            return {
                                ...image,
                                likesDislikes: response.data,
                                like: likeStatus,
                            };
                        } else {
                            return image;
                        }
                    });
                    return newImagesState;
                });
            } catch (error) {
                console.log('Error: ', error);
            }
        } else {
            // need to set timer which resets error message to '' after 3 seconds.
            setLocalError('Log in to like or dislike');
            return;
        }
    };


    const handleDelete = async (imageId) => {
        // delete image if user is logged in.
        try {
            const response = await axiosRequestInstance.delete('http://localhost:8000/api/delete-image/', {data: {imageId}} );
        } catch (error) {
            console.log('Delete Image Error: ', error);
            setLocalError(`Error: ${error}`);
            return;
        }
    };


    return (
        <div className="container">
            <div className="row mt-3">
                {imagesState.length > 0 ? (
                    imagesState.map((image) => (
                        <div key={image.id} className="card col-md-4 mb-3 zoom">
                            <img src={`http://localhost:8000/${image.url}`} alt={image.id} className="card-img-top img-fluid" />
                            <div className="card-body">
                                <NavLink to="" className="card-text">{image.username}</NavLink>
                                <div>
                                    { image.like ? (
                                        <>
                                            <HiThumbUp onClick={() => handleLikeDislike(image.id, null)} /> {image.likesDislikes.likes}
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineThumbUp onClick={() => handleLikeDislike(image.id, true)} /> {image.likesDislikes.likes}
                                        </>
                                    )}
                                    { image.dislike ? (
                                        <>
                                            <HiThumbDown onClick={() => handleLikeDislike(image.id, null)} /> {image.likesDislikes.dislikes}
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineThumbDown onClick={() => handleLikeDislike(image.id, false)} /> {image.likesDislikes.dislikes}
                                        </>
                                    )}
                                </div>
                                {localError && <p className="error-message">{localError}</p>}
                                { user && <button className="btn btn-danger" onClick={() => handleDelete(image.id)}>Delete</button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <h2 className="text-center">No drawings have been submitted.</h2>
                )}
            </div>
        </div>
    );
};

Images.propTypes = {
    imagesList: PropTypes.array,
};

export default Images;