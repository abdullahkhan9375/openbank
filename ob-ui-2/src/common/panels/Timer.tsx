import { useState, useEffect } from 'react';
import { TTime } from '../../pages/Exam/ShowExam';

interface ITimerProps
{
  time: TTime;
  onTimeChange: (aTime: TTime) => void;
  pauseTime: boolean;
}

export const Timer = (aTimerProps: ITimerProps) =>
{
  const lTime = aTimerProps.time;
  const onTimeChange = aTimerProps.onTimeChange;

  const lNowInSeconds: number = Math.floor(Date.now()/1000);
  const lDeadline = lNowInSeconds + (lTime.minutes * 60);

  const getTime = () => {
    const time: number = lDeadline - Math.floor(Date.now()/1000);
    // console.log("Time: ", time);
    onTimeChange({
      minutes: Math.floor((time / 60) % 60),
      seconds: Math.floor(time % 60)
    });
  };

  const lTimeString = `${lTime.minutes.toString().length > 1
      ? `${lTime.minutes}`
      : `0${lTime.minutes}`}: ${lTime.seconds.toString().length > 1 ? `${lTime.seconds}` : `0${lTime.seconds}`}`;
  useEffect(() => {
    if (!aTimerProps.pauseTime)
    {
      const interval = setInterval(() => getTime(), 1000);
      return () => clearInterval(interval);
    }
  }, [aTimerProps.pauseTime]);

  if (aTimerProps.pauseTime)
  {
    return (
      <p className={`text-lg border-gray rounded-sm border-r-4 px-3 py-2 font-bold`}>
        Remaining time: {lTimeString}
      </p>
    );
  }
  else
  {
    return (
      <p className={`text-lg border-gray rounded-sm border-r-4 px-3 py-2 font-bold
      ${lTime.minutes < 1 ? " border-red text-red" : " border-black text-black "}`}>
        {(lTime.seconds > 0 && lTime.minutes > 0) ? `Remaining time
        ${lTimeString}` : "Time Over"}</p>
    );
  }
};

export default Timer;