import { useState } from 'react';

export const AssignmentGrid = ({ assignments, employees, availableRotations, daysOfWeek }) => {
  const [updatedAssignments, setUpdatedAssignments] = useState(assignments);

  const handleAssignmentChange = async (rotation, day, employeeId) => {
    // Update the state locally
    const updatedAssignmentsCopy = { ...updatedAssignments };
    updatedAssignmentsCopy[rotation][day] = employeeId;

    // Update the local state
    setUpdatedAssignments(updatedAssignmentsCopy);

    // Prepare data to send to the backend
    const updatedData = {
      [rotation]: updatedAssignmentsCopy[rotation],
    };

    // Debugging: Log the payload
    console.log('Sending data to backend:', updatedData);

    // Send the updated assignments to the backend
    try {
      const response = await fetch(`/api/assignments/${rotation}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments: updatedData }),  // Ensure the body is correct
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Assignments updated successfully:', data);
      } else {
        console.error('Failed to update assignments:', data);
      }
    } catch (err) {
      console.error('Error updating assignments:', err);
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
                    value={updatedAssignments[rotation][day]}
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
