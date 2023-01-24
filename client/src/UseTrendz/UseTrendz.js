import { useState } from "react";

const UseTrendz = () => {
  const [isGetData, setIsGetData] = useState(false);

  let URI = "http://localhost:5000/";
  const getBalance = async () => {
    const response = await fetch(`${URI}getBalance`);
    const data = response.json();
    return data;
  };
  const getEventData = async () => {
    const response = await fetch(`${URI}getEvent`);
    const data = response.json();
    return data;
  };
  const getTokenData = async () => {
    const response = await fetch(`${URI}getTokenData`);
    const data = response.json();
    return data;
  };
  return {
    getBalance,
    getEventData,
    getTokenData,
    isGetData,
    setIsGetData,
  };
};
export default UseTrendz;
