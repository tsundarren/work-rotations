import { useState, useEffect, useCallback } from 'react';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to fetch employees from the API
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getEmployees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to remove an employee, with optimistic UI update
  const removeEmployee = async (employeeId) => {
    // Optimistically update the employees list by immediately removing the employee
    const previousEmployees = [...employees]; // Keep a backup of the employees list

    setEmployees(prevEmployees => prevEmployees.filter(emp => emp._id !== employeeId));

    try {
      const response = await fetch(`/api/removeEmployee/${employeeId}`, { method: 'DELETE' });
      const text = await response.text();
      if (!response.ok) {
        // Rollback to the previous employees list if the API request fails
        setEmployees(previousEmployees);
        console.error('Failed to remove employee:', text);
      }
    } catch (err) {
      // Rollback in case of network error
      setEmployees(previousEmployees);
      console.error('Error removing employee:', err);
    }
  };

  return { employees, loading, fetchEmployees, removeEmployee };
};
