import { useState, useEffect } from 'react';
import '../styles/AssignmentGrid.css'; // Import the CSS file

export const AssignmentGrid = ({ employees, availableRotations, daysOfWeek }) => {
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

    // Optimistic UI update
    setAssignments((prev) => ({
      ...prev,
      [rotation]: {
        ...prev[rotation],
        [day]: employeeId || '',
      },
    }));

    const updatedData = {
      [rotation]: {
        ...assignments[rotation],
        [day]: employeeId,
      },
    };

    try {
      const response = await fetch(`/api/assignments/${rotation}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments: updatedData }),
      });

      if (!response.ok) throw new Error('Failed to update assignments');

      const updatedAssignmentsData = await fetchAssignmentsFromAPI();
      const formattedAssignments = formatAssignments(updatedAssignmentsData);
      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error updating assignments:', error);
      setAssignments(previousAssignments);
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
