import { useState, useEffect } from 'react';
import '../styles/AssignmentGrid.css'; // Import the CSS file

export const AssignmentGrid = ({ employees, setEmployees, availableRotations, daysOfWeek }) => {
  const [assignments, setAssignments] = useState({});

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

  const handleAssignmentChange = async (rotation, day, employeeId) => {
    const previousAssignments = { ...assignments };
    const previousEmployees = [...employees]; // Store the current employees list

    // Optimistically update assignments
    const newAssignments = {
      ...assignments,
      [rotation]: {
        ...assignments[rotation],
        [day]: employeeId || '', // Employee ID or empty if unassigned
      },
    };

    setAssignments(newAssignments);

    // Update the employee's assigned rotations optimistically
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee._id === employeeId) {
          let updatedAssignedRotations = employee.assignedRotations.includes(rotation)
            ? employee.assignedRotations.filter((r) => r !== rotation) // Remove rotation if unassigning
            : [...employee.assignedRotations, rotation]; // Add rotation if assigning

          console.log(`Updating ${employee.firstName} ${employee.lastName} - New Assigned Rotations:`, updatedAssignedRotations);

          return {
            ...employee,
            assignedRotations: updatedAssignedRotations.length > 0 ? updatedAssignedRotations : [], // Ensure empty array if all removed
          };
        }

        // Handle case where an employee is being removed from the rotation
        if (employee.assignedRotations.includes(rotation) && employeeId === '') {
          const updatedAssignedRotations = employee.assignedRotations.filter((r) => r !== rotation);
          return {
            ...employee,
            assignedRotations: updatedAssignedRotations.length > 0 ? updatedAssignedRotations : [],
          };
        }

        return employee;
      })
    );

    try {
      // Make the API request to update the assignment in the backend
      const response = await fetch(`/api/assignments/${rotation}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignments: newAssignments,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      // Optionally, refetch the assignments if needed
      const updatedData = await fetchAssignmentsFromAPI();
      setAssignments(formatAssignments(updatedData));
    } catch (err) {
      console.error('Error updating assignment:', err);

      // Rollback the optimistic UI changes if API request fails
      setAssignments(previousAssignments);
      setEmployees(previousEmployees);
    }
  };

  const fetchAssignmentsFromAPI = async () => {
    const response = await fetch('/api/getAssignments');
    const data = await response.json();
    return data;
  };

  return (
    <div className="assignment-grid-container">
      <h2 className="section-title">Rotation Assignments</h2>
      <table className="assignment-table">
        <thead>
          <tr>
            <th>Rotation</th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {availableRotations.map((rotation) => (
            <tr key={rotation}>
              <td>{rotation}</td>
              {daysOfWeek.map((day) => (
                <td key={day}>
                  <select
                    value={assignments[rotation]?.[day] || ''}
                    onChange={(e) => handleAssignmentChange(rotation, day, e.target.value)}
                    className="assignment-select"
                  >
                    <option value="">Select Employee</option>
                    {employees
                      .filter((employee) => employee.trainedRotations.includes(rotation))
                      .map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.firstName} {employee.lastName}
                        </option>
                      ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
