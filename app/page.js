'use client';

import { useEffect, useState } from 'react';
import './styles.css'; // Import the CSS file

const availableRotations = [
  'Rotation 1',
  'Rotation 2',
  'Rotation 3',
  'Rotation 4',
  'Rotation 5',
];

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trainedRotations, setTrainedRotations] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/getEmployees');
      const data = await res.json();
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load employees. Please try again later.');
      setLoading(false);
    }
  };

  // Handle form submission to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!firstName.trim() || !lastName.trim() || !trainedRotations.trim()) {
      setError('Please provide first name, last name, and trained rotations.');
      return;
    }

    setError(''); // Clear previous error
    try {
      const response = await fetch('/api/addEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          trainedRotations: trainedRotations.split(',').map((r) => r.trim()),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh employee list after adding
        fetchEmployees();
        // Clear the form
        setFirstName('');
        setLastName('');
        setTrainedRotations('');
      } else {
        setError(data.message || 'Failed to add employee. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleRotationChange = async (employeeId, rotation, checked) => {
    // Update the local state for the employee
    const updatedEmployees = employees.map((emp) =>
      emp._id === employeeId
        ? {
            ...emp,
            trainedRotations: checked
              ? [...emp.trainedRotations, rotation]
              : emp.trainedRotations.filter((r) => r !== rotation),
          }
        : emp
    );
    setEmployees(updatedEmployees);
  
    // Send PATCH request to update employee's trained rotations in the database
    try {
      const response = await fetch(`/api/updateEmployee/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainedRotations: updatedEmployees.find((emp) => emp._id === employeeId).trainedRotations,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Employee updated successfully:', data);
      } else {
        console.error('Error updating employee:', data);
      }
    } catch (err) {
      console.error('Failed to update rotations. Please try again later.', err);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Employee Rotation Assignment</h1>

      {/* Add Employee Form */}
      <div className="form-container">
        <h2 className="form-title">Add Employee</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Trained Rotations (comma-separated)"
            value={trainedRotations}
            onChange={(e) => setTrainedRotations(e.target.value)}
            className="input-field"
          />
          <button
            type="submit"
            className="submit-button"
          >
            Add Employee
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Display Employees */}
      <div>
        <h2 className="section-title">Employees</h2>
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length > 0 ? (
          <ul className="employee-list">
            {employees.map((employee) => (
              <li key={employee._id} className="employee-card">
                <div className="employee-header">
                  <strong>
                    {employee.firstName} {employee.lastName}
                  </strong>
                  <button
                    onClick={() =>
                      setEmployees((prevEmployees) =>
                        prevEmployees.map((emp) =>
                          emp._id === employee._id
                            ? { ...emp, isDropdownOpen: !emp.isDropdownOpen }
                            : emp
                        )
                      )
                    }
                    className="dropdown-button"
                  >
                    <span
                      className={`dropdown-icon ${
                        employee.isDropdownOpen ? 'rotate' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                </div>
                {employee.isDropdownOpen && (
                  <div className="rotation-list">
                    {availableRotations.map((rotation) => (
                      <div key={rotation} className="rotation-item">
                        <input
                          type="checkbox"
                          checked={employee.trainedRotations.includes(rotation)}
                          onChange={(e) =>
                            handleRotationChange(employee._id, rotation, e.target.checked)
                          }
                        />
                        <label>{rotation}</label>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No employees found.</p>
        )}
      </div>
    </div>
  );
}
