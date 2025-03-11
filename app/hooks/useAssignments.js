import { useState, useEffect, useCallback } from 'react';

export const useAssignments = (employees, availableRotations, daysOfWeek) => {
  const [assignments, setAssignments] = useState({});

  // Fetch assignments from the API when the component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/getAssignments');
        const data = await response.json();

        if (response.ok) {
          const formattedAssignments = formatAssignments(data);
          setAssignments(formattedAssignments);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [employees]);

  const formatAssignments = (data) => {
    const formatted = {};
    data.forEach((assignment) => {
      formatted[assignment.rotation] = daysOfWeek.reduce((acc, day) => {
        acc[day] = assignment[day].map((emp) => emp._id);
        return acc;
      }, {});
    });
    return formatted;
  };

  const handleAssignmentChange = useCallback(
    async (rotation, day, employeeId) => {
      try {
        const response = await fetch(`/api/assignments/${rotation}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignments: {
              [rotation]: {
                [day]: employeeId || '', // Assign or unassign employee
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update assignment');
        }

        // Refetch the assignments after a successful update
        const updatedData = await fetchAssignmentsFromAPI();
        setAssignments(formatAssignments(updatedData));
      } catch (err) {
        console.error('Error updating assignment:', err);
      }
    },
    [assignments, availableRotations, daysOfWeek]
  );

  const fetchAssignmentsFromAPI = async () => {
    const response = await fetch('/api/getAssignments');
    const data = await response.json();
    return data;
  };

  return { assignments, handleAssignmentChange };
};
