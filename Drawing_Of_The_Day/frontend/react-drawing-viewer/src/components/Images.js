import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import axiosRequestInstance from '../api/axiosRequestInstance';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';
import { HiOutlineThumbDown, HiOutlineThumbUp, HiThumbDown, HiThumbUp } from "react-icons/hi";
import ImageModal from './ImageModal';


const Images = ({ imagesList }) => {
    // imageState holds image and like and dislikes data
    const [ imagesState, setImagesState ] = useState([]);
    const [localError, setLocalError] = useState('');

    // user holds authorized user data
    const { user } = useAuthContext();

    // imageModalStates holds an object of modal states with image_id as the key
    const [ imageModalStates, setImageModalStates ] = useState({});

    // check if current URL path is the profile page
    const hasProfileInUrl = window.location.pathname.includes('profile');

    // like and dislike data for each image is fetched from django backend and added to images
    const fetchImageLikes = async (imagesList) => {
        if (imagesList && imagesList.length > 0) {
            try {
                // get list of image ids and pass as paramater in backend request
                const imageIds = imagesList.map((image) => image.id);

                // if user logged in then use axiosRequestInstance to check access token expiry and retrieve previous likes and dislike responses
                if (user) {
                    // get like and dislike data for each image in imageList
                    const response = await axiosRequestInstance.get('http://localhost:8000/image-likes-auth/',
                        { params: { image_ids: imageIds } });

                    const likesDislikesCountData = response.data.likesDislikesCount;
                    const likeStatusList = response.data.likeStatusList;

                    // map accross each image in imageList and add response data to it.
                    const newImagesState = imagesList.map((image) => {
                        // get number of likes and dislikes for image.
                        const countData = likesDislikesCountData.find((item) => item[image.id]);

                        // get likeStatus: if user has liked(true), disliked(false) or null for hasn't rated yet.
                        const likeStatus = likeStatusList.find((item) => image.id in item);

                        return {...image, 
                            likesCount: countData[image.id].likes_dislikes_count.likes,
                            dislikesCount: countData[image.id].likes_dislikes_count.dislikes,
                            like: likeStatus ? likeStatus[image.id] : null,
                        }
                    });
                    // set ImageState with number of likes/dislikes count and previous liked/disliked 
                    setImagesState(newImagesState);
                } else {
                    // if user not authorized then normal axios get request
                    const response = await axios.get('http://localhost:8000/image-likes-no-auth/',
                        { params: { image_ids: imageIds } });

                    // map accross each image in imageList and add response data to it.
                    const newImagesState = imagesList.map((image) => {
                        const likesData = response.data.find((item) => item[image.id]);
                        return {...image,
                            likesCount: likesData[image.id].likes_dislikes_count.likes,
                            dislikesCount: likesData[image.id].likes_dislikes_count.dislikes,
                            like: null};
                    });
                    // set ImageState with number of likes and dislikes
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


    // render likes and dislikes buttons depending on what user has selected.
    const LikeDislikeButton = ({ image, handleLikeDislike }) => (
        <div>
            { image.like === true && (
                <>
                    <HiThumbUp onClick={() => handleLikeDislike(image.id, null)} /> {image.likesCount}
                    <HiOutlineThumbDown onClick={() => handleLikeDislike(image.id, false)} /> {image.dislikesCount}
                </>
            )}
            { image.like === false && (
                <>
                    <HiOutlineThumbUp onClick={() => handleLikeDislike(image.id, true)} /> {image.likesCount}
                    <HiThumbDown onClick={() => handleLikeDislike(image.id, null)} /> {image.dislikesCount}
                </>
             )}
             { image.like === null && (
                 <>
                     <HiOutlineThumbUp onClick={() => handleLikeDislike(image.id, true)} /> {image.likesCount}
                     <HiOutlineThumbDown onClick={() => handleLikeDislike(image.id, false)} /> {image.dislikesCount}
                 </>
             )}
        </div>
    );


    const handleLikeDislike = async (imageId, likeStatus) => {
        // function for handling users rating of image.
        // user can only submit rating if logged in.
        if (user) {
            try {
                // submit rating to backend for updating database
                const response = await axiosRequestInstance.post('http://localhost:8000/like-dislike/', {imageId, likeStatus});
                
                // update image like data returned in backend response.
                setImagesState((prevImagesState) => {
                    const newImagesState = prevImagesState.map((image) => {
                        if (image.id === imageId) {
                            const likesDislikesCount = response.data.likesDislikesCount;

                            // update like/dislike count and new like status
                            return {
                                ...image,
                                likesCount: likesDislikesCount[0].likes_dislikes_count.likes || 0,
                                dislikesCount: likesDislikesCount[0].likes_dislikes_count.dislikes || 0,
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
            setLocalError('Log in to like or dislike');

            // error message disappears after 3 seconds.
            setTimeout(() => {
                setLocalError('');
            }, 3000);

            return;
        }
    };


    const handleDelete = async (imageId) => {
        // delete image if user is logged in.
        try {
            await axiosRequestInstance.delete('http://localhost:8000/api/delete-image/', {data: {imageId}} );
        } catch (error) {
            console.log('Delete Image Error: ', error);
            setLocalError(`Error: ${error}`);
            return;
        }
    };


    // function to toggle the modal state for a specific image
    const toggleImageModal = (imageId) => {
        setImageModalStates((prevStates) => ({
            ...prevStates,
            [imageId]: !prevStates[imageId] || false,
        }));
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center mt-3">
                {imagesState.length > 0 ? (
                    imagesState.map((image) => (
                        <div key={image.id} className="card col-md-3 mb-3 me-4">
                            <div onClick={() => toggleImageModal(image.id)}>
                                <img src={`http://localhost:8000/${image.url}`} alt={image.id} className=" img-fluid" />
                            </div>
                            {imageModalStates[image.id] && (<ImageModal
                                showModal={imageModalStates[image.id]}
                                closeModal={() => toggleImageModal(image.id)}
                                imageUrl={image.url}
                                username={image.username}
                                imagePrompt={image.prompt}
                                date={image.prompt_date} />)}

                            <div className="card-body d-flex flex-column">
                                {/*mt-auto pushes div to bottom of card body*/}
                                <div className="mt-auto">
                                    <NavLink to={`/profile/${image.user_id}`} className="card-text">{image.username}</NavLink>
                                    <LikeDislikeButton image={image} handleLikeDislike={handleLikeDislike} />
                                    {localError && <p className="error-message">{localError}</p>}

                                    {/*image delete button only appears for the owner of the image and only on the profile page*/}
                                    { hasProfileInUrl && user && user.username === image.username && (
                                        <button className="btn btn-danger text-center" onClick={() => handleDelete(image.id)}>Delete</button>
                                    )}
                                </div>

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