import React, { useEffect } from 'react';
import '../styles/date.css';
import curDate from '../scripts/date.js';


function CurrentDateHeader() {
    useEffect(() => {
        curDate();
    }, []);

    return (
        <div className="current-date">
            <div className="divider"></div>
            <div className="date-header">Current date:</div>
            <div id='cur-date-timer' className="date">01-01-12:12:12 AM</div>
            <div className="divider"></div>
        </div>
    );
}

export default CurrentDateHeader;