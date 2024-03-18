import PropTypes from 'prop-types';
import  { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';

const Header = ({ date, imagePrompt }) => {
    const [ datePattern, setDatePattern ] = useState(date);

    useEffect(() => {
        // update date format so the month is in word format
        const formatDate = (newDate) => {
            // parse used to convert date string into date object
            const parsedDate = parse(newDate, 'dd-MM-yyyy', new Date());
    
            // format the parsed date as 'dd MMMM yyy' e.g 31 January 2024
            const newDatePattern = format(parsedDate, 'dd MMMMMM yyyy');
            setDatePattern(newDatePattern);
        }
        formatDate(date);
    }, [date]);

    return (
        <div className="text-center mt-3 mb-3">
            <h2>{datePattern}</h2>
            <h5>{imagePrompt}</h5>
        </div>
    );
};

Header.propTypes = {
    date: PropTypes.string,
    imagePrompt: PropTypes.string,
};

export default Header;