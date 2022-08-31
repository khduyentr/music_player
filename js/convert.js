
const roundSeconds = (second) => {
    return Math.floor(second);
}

const formatSeconds = (totalSecond) => {
    
    totalSecond = roundSeconds(totalSecond);

    let minutes = Math.floor(totalSecond / 60);
    let seconds = totalSecond % 60;
  
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
}

const convertPercentToSecond = (percent, songDuration) => {
    let second = (percent * songDuration) / 100;
    second = roundSeconds(second);

    return second;
}

export {
    roundSeconds as roundSeconds,
    formatSeconds as formatSeconds,
    convertPercentToSecond as convertPercentToSecond
}


