import { useState, useCallback } from 'react';

export const useAssignments = (employees, availableRotations, daysOfWeek) => {
  const [assignments, setAssignments] = useState(() => {
    const initialAssignments = {};
    availableRotations.forEach(rotation => {
      initialAssignments[rotation] = {};
      daysOfWeek.forEach(day => {
        initialAssignments[rotation][day] = ''; // Empty string indicates no assignment
      });
    });
    return initialAssignments;
  });

  const handleAssignmentChange = useCallback(async (rotation, day, employeeId) => {
    const previousAssignments = { ...assignments };
    const prevEmployeeId = assignments[rotation]?.[day];

    // Optimistic UI update: Update the assignment immediately in the state
    setAssignments(prev => ({
      ...prev,
      [rotation]: { ...prev[rotation], [day]: employeeId || '' },
    }));

    try {
      // Update the assignment in the backend
      const response = await fetch(`/api/assignments/${rotation}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments: { [rotation]: { [day]: employeeId || '' } } }),
      });

      if (!response.ok) throw new Error('Failed to update assignment');
    } catch (err) {
      // Rollback the optimistic update if the API request fails
      console.error('Error updating assignment:', err);
      setAssignments(previousAssignments); // Rollback
    }
  }, [assignments, availableRotations, daysOfWeek]);

  return { assignments, handleAssignmentChange };
};
