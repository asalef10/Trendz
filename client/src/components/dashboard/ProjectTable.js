import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Spinner,
} from "reactstrap";
const ProjectTables = ({ tableData, tableName, subtitle }) => {
  return (
    <>
      <Card>
        <CardBody>
          <CardTitle style={{ textAlign: "center" }} tag="h5">
            {tableName}
          </CardTitle>
          <CardSubtitle
            style={{ textAlign: "center" }}
            className="mb-2 text-muted"
            tag="h6"
          >
            {subtitle}
          </CardSubtitle>
          {tableData ? (
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((tdata, index) => {
                  const { address, value } = tdata;
                  return (
                    <tr key={index} className="border-top">
                      <td>
                        <a
                          target="_blank"
                          href={`https://etherscan.io/token/${address}`}
                        >
                          {address}
                        </a>
                      </td>
                      <td>{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spinner />
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ProjectTables;
