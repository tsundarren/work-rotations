import { useState, useEffect } from 'react';

export const AssignmentGrid = ({ employees, availableRotations, daysOfWeek, setUnassignedEmployees }) => {
  const [assignments, setAssignments] = useState({});

  // Update unassigned employees after a page refresh or when assignments change
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

          // **Step: Calculate unassigned employees**
          const assignedEmployeeIds = new Set();
          Object.values(formattedAssignments).forEach((dayAssignments) => {
            Object.values(dayAssignments).forEach((employeeIds) => {
              employeeIds.forEach((id) => assignedEmployeeIds.add(id));
            });
          });

          const unassignedEmployees = employees.filter(
            (employee) => !assignedEmployeeIds.has(employee._id)
          );

          setUnassignedEmployees(unassignedEmployees);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [employees, setUnassignedEmployees]);

  // Handle assigning or unassigning an employee
  const handleAssignmentChange = async (rotation, day, employeeId) => {
    const previousAssignments = { ...assignments };
    const prevEmployeeId = assignments[rotation]?.[day];

    // Optimistically update assignments
    setAssignments((prev) => ({
      ...prev,
      [rotation]: {
        ...prev[rotation],
        [day]: employeeId || '',
      },
    }));

    // Optimistically update unassigned employees list
    setUnassignedEmployees((prevEmployees) => {
      let updatedEmployees = [...prevEmployees];

      if (employeeId) {
        // If employee is assigned, remove them from the unassigned list
        updatedEmployees = updatedEmployees.filter((emp) => emp._id !== employeeId);
      }

      if (prevEmployeeId && prevEmployeeId !== employeeId) {
        // If there was a previous employee assigned, add them back
        const prevEmployee = employees.find((emp) => emp._id === prevEmployeeId);
        if (prevEmployee) updatedEmployees.push(prevEmployee);
      }

      return updatedEmployees;
    });

    // Update the backend with new assignments
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

      if (!response.ok) {
        throw new Error('Failed to update assignments');
      }

      // Re-fetch the assignments and unassigned employees after a successful update
      const updatedAssignmentsResponse = await fetch('/api/getAssignments');
      const updatedAssignmentsData = await updatedAssignmentsResponse.json();
      if (updatedAssignmentsResponse.ok) {
        const formattedAssignments = {};
        updatedAssignmentsData.forEach((assignment) => {
          formattedAssignments[assignment.rotation] = {
            Monday: assignment.Monday.map((emp) => emp._id),
            Tuesday: assignment.Tuesday.map((emp) => emp._id),
            Wednesday: assignment.Wednesday.map((emp) => emp._id),
            Thursday: assignment.Thursday.map((emp) => emp._id),
            Friday: assignment.Friday.map((emp) => emp._id),
          };
        });

        setAssignments(formattedAssignments);

        const assignedEmployeeIds = new Set();
        Object.values(formattedAssignments).forEach((dayAssignments) => {
          Object.values(dayAssignments).forEach((employeeIds) => {
            employeeIds.forEach((id) => assignedEmployeeIds.add(id));
          });
        });

        const unassignedEmployees = employees.filter(
          (employee) => !assignedEmployeeIds.has(employee._id)
        );

        setUnassignedEmployees(unassignedEmployees);
      }
    } catch (error) {
      console.error('Error updating assignments:', error);
      setAssignments(previousAssignments);
      setUnassignedEmployees((prevEmployees) => {
        let updatedEmployees = [...prevEmployees];

        if (employeeId) {
          const assignedEmployee = employees.find((emp) => emp._id === employeeId);
          if (assignedEmployee) updatedEmployees.push(assignedEmployee);
        }

        if (prevEmployeeId) {
          updatedEmployees = updatedEmployees.filter((emp) => emp._id !== prevEmployeeId);
        }

        return updatedEmployees;
      });
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
