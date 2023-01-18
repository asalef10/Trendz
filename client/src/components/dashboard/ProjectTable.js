import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Spinner,
} from "reactstrap";

const ProjectTables = ({ tableData, tableName }) => {
  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h5">{tableName}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the projects
          </CardSubtitle>
          {tableData ? (
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>sender</th>
                  <th>receiver</th>
                  <th>value</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((tdata, index) => (
                  <tr key={index} className="border-top">
                    <td>{tdata.sender}</td>
                    <td>{tdata.receiver}</td>
                    <td>{tdata.value}</td>
                  </tr>
                ))}
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
