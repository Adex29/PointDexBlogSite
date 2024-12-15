import React, { useEffect, useState } from 'react';

const DateTimeDisplay = () => {
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const d = new Date();
            setCurrentDateTime(d.toLocaleString());
        };

        // Update the date and time every second
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return <h4 id="datetime">{currentDateTime}</h4>;
};

export default DateTimeDisplay;
