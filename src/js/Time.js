import React from "react";

const format = (num) => num.toString().padStart(2, '0');

const Time = ({ title, date }) => {
  const dateObj = new Date(date * 1000);
  const hours = dateObj.getHours();
  const mins = dateObj.getMinutes();

  return (
  <div className="text-center">
    <h3 className="text-xl">{title}</h3>
    <time className="text-lg">{format(hours)}:{format(mins)}</time>
  </div>
)}

export default Time;
