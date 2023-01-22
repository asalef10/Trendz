import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import UseTrendz from "../../UseTrendz/UseTrendz";
import { useEffect, useState } from "react";

const SalesChart = () => {
  const { getTokenData } = UseTrendz();
  const [arrayBalance, setArrayBalance] = useState([]);
  const [arrayTime, setArrayTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let array = await getTokenData();
    array.res?.map((item) => {
      let number = Number(item.yCRVToken)
      setArrayBalance((old) => [...old, number]);
      setArrayTime((old) => [...old, item.TrendzDate]);
    });
    setLoading(false)
  };
  let series = [
    {
      name: "Quantity",
      data: arrayBalance,
    },
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
          Annual Sales Report
        </CardSubtitle>
        {loading ? <div>Loading...</div> : <Chart
          type="area"
          width="100%"
          height="390"
          options={options}
          series={series}
        ></Chart>}
      </CardBody>
    </Card>
  );
};
export default SalesChart;
