import { useState, useEffect, useCallback } from 'react';

export const useUnassignedEmployees = (employees, assignments) => {
  const [unassignedEmployees, setUnassignedEmployees] = useState([]);

  // useCallback to memoize the function and prevent unnecessary re-renders
  const updateUnassignedEmployees = useCallback(() => {
    const assignedEmployeeIds = new Set();
    Object.values(assignments).forEach(rotation =>
      Object.values(rotation).forEach(empId => {
        if (empId) assignedEmployeeIds.add(empId);
      })
    );

    setUnassignedEmployees(employees.filter(emp => !assignedEmployeeIds.has(emp._id)));
  }, [employees, assignments]); // Dependencies: updates when employees or assignments change

  useEffect(() => {
    updateUnassignedEmployees(); // Call the function when dependencies change
  }, [updateUnassignedEmployees]); // useEffect to trigger the update when dependencies change

  return { unassignedEmployees, updateUnassignedEmployees };
};
