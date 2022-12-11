import React from 'react';
import { useState, useEffect } from 'react';

interface ITimerProps
{
    timeInMinutes: number;
    onTimeUp: ((aMinute: number) => void);
}

export const Timer = (aTimerProps: ITimerProps) => {
  const [ minutes, setMinutes ] = useState<number>(aTimerProps.timeInMinutes);
  const [ seconds, setSeconds ] = useState<number>(0);
  const [ timeUp, setTimeUp ] = useState<boolean>(false);

  const lNow: number = Date.now();
  const deadline = lNow + aTimerProps.timeInMinutes * 60 * 1000;

  const getTime = () => {
    const time: number = deadline - Date.now();
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    setTimeUp(seconds <= 0 && minutes <= 0);
    return () => clearInterval(interval);
  }, []);

  useEffect(() =>
  {
    if (timeUp) aTimerProps.onTimeUp(minutes + Math.floor((seconds / 60)))
  }, [timeUp]);

  return (
    <p className={`text-lg border-gray rounded-sm border-r-4 px-3 py-2 font-bold ${minutes < 1 ? " border-red text-red" : " border-black text-black "}`}> {!(seconds <= 0 && minutes <= 0) ? `Remaining time ${minutes}:${seconds}` : "Time Over"}</p>
  );
};

export default Timer;