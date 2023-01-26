import {
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Spinner,
  Button,
} from "reactstrap";
import Chart from "react-apexcharts";
import UseTrendz from "../../UseTrendz/UseTrendz";
import { useEffect, useState } from "react";

const SalesChart = () => {
  const { getTokenData, getLedgerPoolData } = UseTrendz();
  const [arrayBalance, setArrayBalance] = useState([]);
  const [arrayTime, setArrayTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seriesOBJOne, setSeriesOBJOne] = useState({});
  const [seriesOBJTwo, setSeriesOBJTwo] = useState({});
  const [isOn, setIsOn] = useState(false);
  const [titleChart, setTitleChart] = useState("Currency report");

  useEffect(() => {
    getTokenInfo_chart();
  }, []);

  const restAllState = () => {
    setArrayBalance([]);
    setArrayTime([]);
    setSeriesOBJOne({});
    setSeriesOBJTwo({});
  };
  const getTokenInfo_chart = async () => {
    try {
      setLoading(true);
      let array = await getTokenData();
      array.res?.map((item) => {
        let number = Number(item.yCRVToken);
        setArrayBalance((old) => [...old, number]);
        setArrayTime((old) => [...old, item.dateStore]);
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const getPoolLedger_chart = async (range) => {
    try {
      if (range === "24 hours") {
        setTitleChart("Ledger pool last - 24 hours  ");
      } else if (range === "3 days") {
        setTitleChart("Ledger pool last - 3 days  ");
      }
      restAllState();
      setLoading(true);
      let array = await getLedgerPoolData(range);
      array.res?.map((item) => {
        let amountIntNumbers = Number(item.amountIn_tokeLiquidity);
        let amountOutNumbers = Number(item.amountOut_tokenLiquidity);
        setArrayTime((old) => [...old, item.date]);
        setSeriesOBJOne((old) => ({
          name: "AmountIn",
          data: old.data ? [...old.data, amountIntNumbers] : [amountIntNumbers],
        }));
        setSeriesOBJTwo((old) => ({
          name: "AmountOut",
          data: old.data ? [...old.data, amountOutNumbers] : [amountOutNumbers],
        }));
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const replaceChart = async () => {
    if (!isOn) {
      restAllState();
      getPoolLedger_chart("24 hours");
      setIsOn((prev) => !prev);
    } else {
      setTitleChart("Currency report");
      setLoading(false);
      getTokenInfo_chart();
      setIsOn((prev) => !prev);
    }
  };
  function createSeriesObject({ name, data }) {
    return { name, data };
  }
  let series = isOn
    ? [createSeriesObject(seriesOBJOne), createSeriesObject(seriesOBJTwo)]
    : [createSeriesObject({ name: "Quantity", data: arrayBalance })];

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
    <>
      {isOn ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={replaceChart} color="success">
            Currency report
          </Button>
          <Button
            onClick={() => {
              getPoolLedger_chart("3 days");
            }}
            color="info"
          >
            Last 3 days
          </Button>
          <Button
            onClick={() => {
              getPoolLedger_chart("24 hours");
            }}
            color="info"
          >
            Last 24 hours
          </Button>
        </div>
      ) : (
        <Button onClick={replaceChart} color="success">
          Pool report
        </Button>
      )}
      <Card>
        <CardBody>
          <CardTitle tag="h5">{titleChart}</CardTitle>
          <CardSubtitle className="text-muted" tag="h6">
            {/* Currency report */}
          </CardSubtitle>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spinner />
            </div>
          ) : (
            <Chart
              type="area"
              width="100%"
              height="390"
              options={options}
              series={series}
            ></Chart>
          )}
        </CardBody>
      </Card>
    </>
  );
};
export default SalesChart;
