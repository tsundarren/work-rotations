import React from "react";
import '../styles/UnassignedEmployeesTable.css'; // Import the CSS file

export const UnassignedEmployeesTable = ({ unassignedEmployees }) => {
  const renderUnassignedEmployees = () => {
    return unassignedEmployees.length > 0 ? (
      unassignedEmployees.map((employee) => (
        <tr key={employee._id}>
          <td>{employee.firstName} {employee.lastName}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td>No unassigned employees</td>
      </tr>
    );
  };

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
          {renderUnassignedEmployees()}
        </tbody>
      </table>
    </div>
  );
};
