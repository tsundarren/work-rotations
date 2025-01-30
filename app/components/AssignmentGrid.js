export const AssignmentGrid = ({ assignments, employees, availableRotations, daysOfWeek, handleAssignmentChange }) => {
    return (
      <div>
        <h2 className="section-title">Rotation Assignments</h2>
        <table className="assignment-table">
          <thead>
            <tr>
              <th>Rotation</th>
              {daysOfWeek.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availableRotations.map(rotation => (
              <tr key={rotation}>
                <td>{rotation}</td>
                {daysOfWeek.map(day => (
                  <td key={day}>
                    <select
                      value={assignments[rotation][day]}
                      onChange={e => handleAssignmentChange(rotation, day, e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees
                        .filter(employee => employee.trainedRotations.includes(rotation))
                        .map(employee => (
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
