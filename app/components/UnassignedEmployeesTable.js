import { useEffect, useState } from "react";

export const UnassignedEmployeesTable = () => {
  const [unassignedEmployees, setUnassignedEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/getEmployees"); // Adjust API endpoint if needed
        const data = await response.json();

        if (Array.isArray(data)) {
          const unassigned = data.filter(
            (employee) =>
              !employee.assignedRotations || employee.assignedRotations.length === 0
          );
          setUnassignedEmployees(unassigned);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

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
          {unassignedEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.firstName} {employee.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
