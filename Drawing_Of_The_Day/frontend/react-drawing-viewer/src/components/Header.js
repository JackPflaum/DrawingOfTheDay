import PropTypes from 'prop-types';

const Header = ({ date, imagePrompt }) => {
    return (
        <div className="text-center">
            <h4>Todays Date: {date}</h4>
            <p>Prompt Text: {imagePrompt}</p>
        </div>
    );
};

Header.propTypes = {
    date: PropTypes.string,
    imagePrompt: PropTypes.string,
};

export default Header;