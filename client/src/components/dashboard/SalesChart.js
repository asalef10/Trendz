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
import ButtonGroup from "../fetchers/ButtonGroup";

const SalesChart = () => {
  const { getLedgerPoolData } = UseTrendz();
  const [loading, setLoading] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const [titleChart, setTitleChart] = useState("Currency report");
  const [arrayTime, setArrayTime] = useState([]);
  const [arrayBalance, setArrayBalance] = useState([]);
  const [seriesOBJOne, setSeriesOBJOne] = useState({});
  const [seriesOBJTwo, setSeriesOBJTwo] = useState({});

  const restAllState = () => {
    setArrayBalance([]);
    setArrayTime([]);
    setSeriesOBJOne({});
    setSeriesOBJTwo({});
  };
  const getData = async (range, type) => {
    try {
      restAllState();
      setLoading(true);
      let array = await getLedgerPoolData(type, range);
      if (type === "Token") {
        setArrayTime(Object.keys(array.response));
        setArrayBalance(Object.values(array.response));
      } else {
        console.log(array);
        setSeriesOBJOne(() => ({
          name: "AmountIn",
          data: array.response[0],
        }));
        setSeriesOBJTwo(() => ({
          name: "AmountOut",
          data: array.response[1],
        }));
        setArrayTime(array.response[2]);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const createSeriesObject = ({ name, data }) => {
    return { name, data };
  };

  let series = isOn
    ? [createSeriesObject(seriesOBJOne), createSeriesObject(seriesOBJTwo)]
    : [createSeriesObject({ name: "Quantity", data: arrayBalance })];

  const replaceChart = async () => {
    try {
      if (!isOn) {
        setTitleChart("Ledger pool last - 24 hours ");
        getData("1 DAY", "Ledger");
      } else {
        setTitleChart("Currency report");
        getData("1 DAY", "Token");
      }
      setIsOn((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData("1 DAY", "Token");
  }, []);

  let options = {
    chart: {
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    animations: {
      enabled: !loading,
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={replaceChart} color="success">
          {!isOn ? "Pool report" : " Currency report"}
        </Button>
        {isOn && (
          <>
            <ButtonGroup
              threeDaysHandle={() => {
                getData("3 DAY", "Ledger");
              }}
              oneDayHandle={() => {
                getData("1 DAY", "Ledger");
              }}
            />
          </>
        )}

      {!isOn && (
        <ButtonGroup
        threeDaysHandle={() => {
          getData("3 DAY", "Token");
        }}
        oneDayHandle={() => {
          getData("1 DAY", "Token");
        }}
        />
        )}
        </div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">{titleChart}</CardTitle>
          <CardSubtitle className="text-muted" tag="h6">
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
