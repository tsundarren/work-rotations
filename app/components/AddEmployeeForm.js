import { useState, useEffect } from 'react';

export const AddEmployeeForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  trainedRotations,
  handleRotationSelection,
  handleSubmit,
  error,
  availableRotations,
  role: parentRole,
  setRole: parentSetRole, // New prop for setting the role
}) => {
  // Set default role if parent role is not provided
  const [role, setRole] = useState(parentRole || 'Specimen Accessioner');

  // If parent passes setRole, we use it, otherwise we can use our own setRole
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (parentSetRole) {
      parentSetRole(selectedRole); // Update the parent's role as well if necessary
    }
  };

  return (
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

        {/* Role Dropdown */}
        <div className="role-dropdown">
          <label htmlFor="role" className="role-label">Role:</label>
          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            className="input-field"
            required
          >
            <option value="Specimen Accessioner">Specimen Accessioner</option>
            <option value="SPS">SPS</option>
            <option value="Senior SPS">Senior SPS</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Team Lead Coordinator">Team Lead Coordinator</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Add Employee
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};
