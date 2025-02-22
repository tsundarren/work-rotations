import { useState, useEffect } from 'react';
import '../styles/AddEmployeeForm.css'; // Import the CSS file

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
  setRole: parentSetRole,
}) => {
  // Default role is 'Specimen Accessioner' if parentRole is not provided
  const [role, setRole] = useState(parentRole || 'Specimen Accessioner');

  // Handle role change and propagate to parent if necessary
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    parentSetRole && parentSetRole(selectedRole); // Update parent role if setRole is provided
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Employee</h2>
      <form onSubmit={handleSubmit} className="form">
        <InputField
          value={firstName}
          setValue={setFirstName}
          placeholder="First Name"
        />
        <InputField
          value={lastName}
          setValue={setLastName}
          placeholder="Last Name"
        />

        <RotationCheckboxes
          availableRotations={availableRotations}
          trainedRotations={trainedRotations}
          handleRotationSelection={handleRotationSelection}
        />

        <RoleDropdown role={role} handleRoleChange={handleRoleChange} />

        <button type="submit" className="submit-button">
          Add Employee
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

// Reusable InputField component
const InputField = ({ value, setValue, placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="input-field"
    required
  />
);

// Reusable RotationCheckboxes component
const RotationCheckboxes = ({ availableRotations, trainedRotations, handleRotationSelection }) => (
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
);

// Reusable RoleDropdown component
const RoleDropdown = ({ role, handleRoleChange }) => (
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
);
