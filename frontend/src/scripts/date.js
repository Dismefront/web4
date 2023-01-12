let intervalID = undefined;

function curDate() {
    const date = new Date();
    const formatted = date.toLocaleString('en-US').split(',').join(' ');
    const timer = document.getElementById("cur-date-timer");
    if (timer) {
        timer.innerHTML = formatted;
        if (!intervalID)
            intervalID = setInterval(curDate, 1000);
    }
    else {
        if (intervalID)
            clearInterval(curDate);
    }
}

export default curDate;