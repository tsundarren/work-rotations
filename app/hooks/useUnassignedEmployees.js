import { useState } from 'react';

export const useUnassignedEmployees = (employees, assignments) => {
  const [unassignedEmployees, setUnassignedEmployees] = useState([]);

  const updateUnassignedEmployees = () => {
    const assignedEmployeeIds = new Set();
    Object.values(assignments).forEach(rotation =>
      Object.values(rotation).forEach(empId => {
        if (empId) assignedEmployeeIds.add(empId);
      })
    );
    setUnassignedEmployees(employees.filter(emp => !assignedEmployeeIds.has(emp._id)));
  };

  return { unassignedEmployees, updateUnassignedEmployees };
};
