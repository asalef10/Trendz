import { useState } from "react";

const UseTrendz = () => {
  const [isGetData, setIsGetData] = useState(false);

  let URI = "http://localhost:5000/";

  const getBalance = async () => {
    try {
      const response = await fetch(`${URI}getBalance`);
      const data = response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  const getEventData = async () => {
    try {
      // const response = await fetch(`${URI}getEvent`);
      // const data = response.json();
      return [];
    } catch (err) {
      console.log(err);
    }
  };

  const getLedgerPoolData = async (_type,_timeRange) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "content-length": "355",
          "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          type :_type,
          timeRange: _timeRange,
        }),
      };
      const response = await fetch(`${URI}getLedger`, requestOptions);
      const data = response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  const getTotalAddressTx = async () => {
    try {
      const response = await fetch(`${URI}getTotalAddressTx`);
      const data = response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  return {
    getBalance,
    getEventData,
    setIsGetData,
    getLedgerPoolData,
    getTotalAddressTx
  };
};
export default UseTrendz;
