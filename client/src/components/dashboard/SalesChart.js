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
  const [arrayDate, setArrayDate] = useState([]);
  const [series, setSeries] = useState([]);
  const [cache, setCache] = useState([]);

  const getData = async (range, type) => {
    try {
      setLoading(true);
      let array = await getLedgerPoolData(type, range);
      if (type === "Token") {
        setTitleChart(`Currency report last - ${range} `); 
        let time = Object.keys(array.response);
        setArrayDate(time);
        let Quantity = Object.values(array.response);
        setSeries([
          {
            name: "Quantity",
            data: Quantity,
          },
        ]);
       
      } else {
        setTitleChart(`Ledger pool last - ${range} `);
        setSeries([
          {
            name: "AmountIn",
            data: array.response[0],
          },
          {
            name: "AmountOut",
            data: array.response[1],
          },
        ]);
        setArrayDate(array.response[2]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const replaceChart = async () => {
    try {
      if (!isOn) {
        getData("1 DAY", "Ledger");
      } else {
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
      categories: arrayDate,
    },
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={replaceChart} color="success">
          {!isOn ? "Display pool report" : "Display Currency report"}
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
              threeMonthsHandle={() => {
                getData("3 MONTH", "Ledger");
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
            threeMonthsHandle={() => {
              getData("3 MONTH", "Token");
            }}
          />
        )}
      </div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">{titleChart}</CardTitle>
          <CardSubtitle className="text-muted" tag="h6"></CardSubtitle>
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
