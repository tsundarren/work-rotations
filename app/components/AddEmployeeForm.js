import { useState } from 'react';

export const AddEmployeeForm = ({ firstName, setFirstName, lastName, setLastName, trainedRotations, handleRotationSelection, handleSubmit, error, availableRotations }) => {
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

        <button type="submit" className="submit-button">
          Add Employee
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};
