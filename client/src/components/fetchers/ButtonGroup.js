import { Button } from "reactstrap";

const ButtonGroup = ({oneDayHandle, threeDaysHandle }) => {
  return (
    <>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        
        <Button
          className="btn"
          onClick={() => {
            oneDayHandle("");
          }}
          color="info"
        >
           24 hours
        </Button>
        &nbsp;
        <Button
          className="btn"
          onClick={() => {
            threeDaysHandle();
          }}
          color="success"
        >
           3 days
        </Button>
        &nbsp;
        <Button
          className="btn"
          onClick={() => {
            threeDaysHandle();
          }}
          color="primary"
        >
           3 Months
        </Button>
      </div>
    </>
  );
};
export default ButtonGroup;
