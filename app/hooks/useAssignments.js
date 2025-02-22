import { useState } from 'react';

export const useAssignments = (employees, availableRotations, daysOfWeek) => {
  const [assignments, setAssignments] = useState(() => {
    const initialAssignments = {};
    availableRotations.forEach(rotation => {
      initialAssignments[rotation] = {};
      daysOfWeek.forEach(day => {
        initialAssignments[rotation][day] = '';
      });
    });
    return initialAssignments;
  });

  const handleAssignmentChange = async (rotation, day, employeeId) => {
    const previousAssignments = { ...assignments };
    const prevEmployeeId = assignments[rotation]?.[day];

    setAssignments(prev => ({
      ...prev,
      [rotation]: { ...prev[rotation], [day]: employeeId || '' }
    }));

    try {
      const response = await fetch(`/api/updateAssignment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotation, day, employeeId }),
      });

      if (!response.ok) throw new Error('Failed to update assignment');
      // You can add logic to update unassigned employees here if needed
    } catch (err) {
      setAssignments(previousAssignments);
      // Handle errors or rollback updates if needed
    }
  };

  return { assignments, handleAssignmentChange };
};
