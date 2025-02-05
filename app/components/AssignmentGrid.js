import { useState, useEffect } from 'react';

export const AssignmentGrid = ({ employees, availableRotations, daysOfWeek }) => {
  const [assignments, setAssignments] = useState({});

  // Fetch assignments when component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/getAssignments');
        const data = await response.json();

        if (response.ok) {
          const formattedAssignments = {};
          data.forEach((assignment) => {
            formattedAssignments[assignment.rotation] = {
              Monday: assignment.Monday.map((emp) => emp._id),
              Tuesday: assignment.Tuesday.map((emp) => emp._id),
              Wednesday: assignment.Wednesday.map((emp) => emp._id),
              Thursday: assignment.Thursday.map((emp) => emp._id),
              Friday: assignment.Friday.map((emp) => emp._id),
            };
          });
          setAssignments(formattedAssignments);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  // Handle assignment changes and send updated data to the backend
  const handleAssignmentChange = async (rotation, day, employeeId) => {
    // Update state locally
    setAssignments((prev) => ({
      ...prev,
      [rotation]: {
        ...prev[rotation],
        [day]: employeeId,
      },
    }));

    // Prepare updated data
    const updatedData = {
      [rotation]: {
        ...assignments[rotation],
        [day]: employeeId,
      },
    };

    try {
      // Send the updated data to the backend
      const response = await fetch(`/api/assignments/${rotation}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments: updatedData }),
      });

      if (response.ok) {
        console.log('Assignments updated successfully');
      } else {
        console.error('Failed to update assignments');
      }
    } catch (error) {
      console.error('Error updating assignments:', error);
    }
  };

  return (
    <div>
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
