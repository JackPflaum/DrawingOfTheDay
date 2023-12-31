import PropTypes from 'prop-types';

const Images = ({ imagesList }) => {
    return (
        <div className="container">
            <div className="row">
                {imagesList ? (
                    imagesList.map((image) => (
                        <div key={image.id} className="col-md-4 mb-3">
                            <img src={image.url} alt={image.id} className="img-fluid" />
                        </div>
                    ))
                ) : (
                    <h2>No Images Yet!</h2>
                )}
            </div>
        </div>
    );
};

Images.propTypes = {
    imagesList: PropTypes.array,
}

export default Images;