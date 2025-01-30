export const UnassignedEmployeesTable = ({ unassignedEmployees }) => {
    return (
      <div>
        <h2 className="section-title">Unassigned Employees</h2>
        <table className="unassigned-table">
          <thead>
            <tr>
              <th>Employee</th>
            </tr>
          </thead>
          <tbody>
            {unassignedEmployees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.firstName} {employee.lastName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};
