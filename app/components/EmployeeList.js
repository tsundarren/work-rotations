import { useState } from 'react';
import { EmployeeCard } from './EmployeeCard';

export const EmployeeList = ({ employees, availableRotations, handleRotationChange, removeEmployee }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (employeeId) => {
    if (openDropdown === employeeId) {
      setOpenDropdown(null); // Close dropdown if same employee clicked
    } else {
      setOpenDropdown(employeeId); // Open dropdown for clicked employee
    }
  };

  return (
    <div>
      <h2 className="section-title">Employees</h2>
      {employees.length > 0 ? (
        <ul className="employee-list">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              openDropdown={openDropdown}
              toggleDropdown={toggleDropdown}
              handleRotationChange={handleRotationChange}
              removeEmployee={removeEmployee}
              availableRotations={availableRotations}
            />
          ))}
        </ul>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
};
