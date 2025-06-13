'use client'
import React, { useEffect, useState } from 'react';
import BlackFriday from "../../../public/images/BlackFriday.jpg";
import Image from 'next/image';

const BlackFridayHero = () => {
  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <div className='relative w-[76%] h-[400px] mx-auto mt-20 mb-10'>
      <Image
        src={BlackFriday}
        alt='Black Friday Image'
        fill
        className='object-cover '
        priority
      />
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white  bg-opacity-30">
        <h1 className="text-3xl md:text-5xl font-extralight mb-2 tracking-wide">BLACK FRIDAY</h1>
        <p className="text-sm md:text-base mb-4">get 20% off if you spend 120$ or more!</p>
        <div className="flex text-center text-xs md:text-sm divide-x divide-white">
          <div className='px-4'>
            <p className="text-2xl md:text-3xl ">{timeLeft.days}</p>
            <span>DAYS</span>
          </div>
          <div className='px-4'>
            <p className="text-2xl md:text-3xl ">{timeLeft.hours}</p>
            <span>HOURS</span>
          </div>
          <div className='px-4'>
            <p className="text-2xl md:text-3xl">{timeLeft.minutes}</p>
            <span>MINUTES</span>
          </div>
          <div className='px-4'>
            <p className="text-2xl md:text-3xl">{timeLeft.seconds}</p>
            <span>SECONDS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackFridayHero;
