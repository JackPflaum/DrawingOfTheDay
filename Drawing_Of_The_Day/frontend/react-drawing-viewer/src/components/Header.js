import PropTypes from 'prop-types';

const Header = ({ date, imagePrompt }) => {
    return (
        <>
            <h2>Todays Date: {date}</h2>
            <p>Prompt Text: {imagePrompt}</p>
        </>
    );
};

Header.propTypes = {
    date: PropTypes.string,
    imagePrompt: PropTypes.string,
};

export default Header;