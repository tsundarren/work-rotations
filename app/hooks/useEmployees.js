import { useState, useEffect } from 'react';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
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
  };

  const removeEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/removeEmployee/${employeeId}`, { method: 'DELETE' });
      const text = await response.text();
      if (response.ok) {
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp._id !== employeeId));
      } else {
        console.error('Failed to remove employee:', text);
      }
    } catch (err) {
      console.error('Error removing employee:', err);
    }
  };

  return { employees, loading, fetchEmployees, removeEmployee };
};
