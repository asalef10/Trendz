import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import UseTrendz from "../../UseTrendz/UseTrendz";
import { useEffect, useState } from "react";

const SalesChart = () => {
  const { getTokenData } = UseTrendz();
  const [arrayBalance, setArrayBalance] = useState([]);
  const [arrayTime, setArrayTime] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let array = await getTokenData();
    array.res?.map((item) => {
      let number = parseInt(item.yCRVToken);
      setArrayBalance((old) => [...old, number]);
      setArrayTime((old) => [...old, item.TrendzDate]);
    });
    console.log(arrayTime);
  };
  let series = [
    {
      name: "Quantity",
      data: arrayBalance,
    },
    // {
    //   name: "Oneplue 9",
    //   data: [0, 1100000000, 32, 45, 32, 34, 52, 41],
    //   },
  ];

  let options = {
    chart: {
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 3,
    },

    stroke: {
      curve: "smooth",
      width: 1,
    },

    xaxis: {
      categories: arrayTime,
    },
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={options}
          series={series}
        ></Chart>
      </CardBody>
    </Card>
  );
};

export default SalesChart;
