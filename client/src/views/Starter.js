import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";
import TopCards from "../components/dashboard/TopCards";
import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import { useEffect, useState } from "react";
import UseApi from "../UseTrendz/UseTrendz";
import UseTrendz from "../UseTrendz/UseTrendz";

const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

const Starter = () => {
  const FIVE_MIN = 1000 * 60 * 5;
  const { isGetData, setIsGetData, getTotalAddressTx } = UseTrendz();

  const [tableData, setTableData] = useState([]);
  const [amount_yCRVToken, setAmount_yCRVToken] = useState(0);
  const { getBalance, getEventData } = UseApi();

  useEffect(async () => {
    getData();
  }, []);

  useEffect(async () => {
    getAmount_yCRVToken();
  }, [isGetData]);

  const getData = async () => {
   
    let data = await getTotalAddressTx();
    setTableData(data);
    handleTimer();
  };

  const getAmount_yCRVToken = async () => {
    let amount_yCRV = await getBalance();
    let num = Number(amount_yCRV).toFixed(3);

    setAmount_yCRVToken(num);
  };
  const handleTimer = () => {
    setInterval(() => {
      setIsGetData((prev) => !prev);
    }, FIVE_MIN);
  };

  return (
    <div>
      {/***Top Cards***/}
      <Row>
        <Col sm="50" lg="30">
          <TopCards
            bg="bg-light-danger text-danger"
            title="yCRV Token"
            subtitle="yCRV Token in liquidity"
            earning={amount_yCRVToken}
            icon="bi bi-coin"
          />
        </Col>
        {/* <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-success text-success"
            title="Profit"
            subtitle="Yearly Earning"
            earning="$21k"
            icon="bi bi-wallet"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-warning text-warning"
            title="New Project"
            subtitle="Yearly Project"
            earning="456"
            icon="bi bi-basket3"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Weekly Sales"
            earning="210"
            icon="bi bi-bag"
          />
        </Col> */}
      </Row>
      {/***Sales & Feed***/}
      <Row>
        <Col sm="6" lg="6" xl="7" xxl="8">
          <SalesChart />
        </Col>
        <Col sm="6" lg="6" xl="5" xxl="4">
          <Feeds />
        </Col>
      </Row>
      {/***Table ***/}
      <Row>
        <Col lg="12">
          <div style={{display:"flex"}}>

          <ProjectTables
            tableData={tableData[0]?.deposit}
            tableName="Deposit"
            subtitle={"Total 5 address that deposited the most"}
            />
            &nbsp;
            &nbsp; 
          <ProjectTables
            tableData={tableData[1]?.withdraw}
            tableName="Withdraw"
            subtitle={"Total 5 address that withdraw the most"}
            /> 
            </div>
        </Col>
      </Row>
      {/***Blog Cards***/}
      {/* <Row>
        {BlogData?.map((blg, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={blg.image}
              title={blg.title}
              subtitle={blg.subtitle}
              text={blg.description}
              color={blg.btnbg}
            />
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default Starter;
