import React, { useState, useEffect } from "react";

function Timer({ targetDate, handleTimerEnd }) {
  const getTimeLeft = () => {
    const diff = Math.max(Date.parse(targetDate) - Date.now(), 0);
    return {
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        handleTimerEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, handleTimerEnd]);

  return (
    <div className="rounded-xl bg-white p-4 shadow-md text-center">
      <div className="font-bold text-3xl text-[#2a3fb8] tracking-wide">
        {String(timeLeft.minutes).padStart(2, "0")} : {String(timeLeft.seconds).padStart(2, "0")}
      </div>
      <div className="text-[10px] mt-0.5 flex justify-between px-1">
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  );
}

export default Timer;
