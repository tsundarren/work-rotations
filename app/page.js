'use client';

import { useEffect, useState } from 'react';
import './styles.css'; 

const availableRotations = [
  'BN', 'Expeditor', 'Blue Bag', 'Manual 1', 'Prisma SPL',
  'Prisma Tracking', 'Making Shipment Boxes', 'Setting Up BN Shipment', 'Prisma TOUCH', 'Prisma Frozen',
  'Weights', 'TOUCH', 'Micro', 'Cyto', 'QFT',
  'SPN/SORT/SCAN', 'Histo/Frozens Matchup', 'REF', 'Breath Bag/Novant/Pack up', 'PHC',
  'Ref Match-Up', 'Floater', 'Biohazard', 'Clean Sweep', 'Imaging',
  'Nightly Report', 'Verify BN IRR', 'DST/LAB-IN-THE BOX', 'Schedule Board', 'Disinfection Log'
];

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trainedRotations, setTrainedRotations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      console.error('Failed to load employees:', err);
      setError('Failed to load employees. Please try again later.');
      setLoading(false);
    }
  };

  const handleRotationSelection = (rotation) => {
    setTrainedRotations((prev) =>
      prev.includes(rotation) ? prev.filter((r) => r !== rotation) : [...prev, rotation]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || trainedRotations.length === 0) {
      setError('Please provide first name, last name, and select at least one rotation.');
      return;
    }

    setError('');
    try {
      const response = await fetch('/api/addEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          trainedRotations,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchEmployees();
        setFirstName('');
        setLastName('');
        setTrainedRotations([]);
      } else {
        setError(data.message || 'Failed to add employee. Please try again.');
      }
    } catch (err) {
      console.error('Something went wrong:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleRotationChange = async (employeeId, rotation, checked) => {
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

          {/* 6x5 Grid Layout for New Employee Form */}
          <div className="checkbox-grid">
            {availableRotations.map((rotation) => (
              <label key={rotation} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={trainedRotations.includes(rotation)}
                  onChange={() => handleRotationSelection(rotation)}
                />
                {rotation}
              </label>
            ))}
          </div>

          <button type="submit" className="submit-button">
            Add Employee
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

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
                      <label key={rotation} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={employee.trainedRotations.includes(rotation)}
                          onChange={(e) =>
                            handleRotationChange(employee._id, rotation, e.target.checked)
                          }
                        />
                        {rotation}
                      </label>
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
