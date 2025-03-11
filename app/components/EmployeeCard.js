import { useState } from 'react';
import '../styles/EmployeeCard.css';

export const EmployeeCard = ({
    employee,
    openDropdown,
    toggleDropdown,
    handleRotationChange,
    removeEmployee,
    availableRotations,
    handleRoleChange,
}) => {
    const [editingRotations, setEditingRotations] = useState(false);

    const handleToggleDropdown = () => {
        toggleDropdown(employee._id);
        setEditingRotations(false); // Reset rotation editing when toggling dropdown
    };

    // Role color mapping
    const roleColor = {
        'Team Lead': 'bg-pink-500',
        'Team Lead Coordinator': 'bg-pink-500',
        'Supervisor': 'bg-pink-500',
        'SPS': 'bg-yellow-500',
        'Senior SPS': 'bg-yellow-500',
        'Specimen Accessioner': 'bg-yellow-500',
    };

    // Get the correct card color based on the role
    const cardColor = roleColor[employee.role] || 'bg-yellow-500';

    const renderDropdownMenu = () => (
        <div className="dropdown-overlay">
            <button
                onClick={() => setEditingRotations(true)} // Show Edit Rotations menu
                className="dropdown-option"
            >
                Edit Rotations
            </button>
            <button
                onClick={() => removeEmployee(employee._id)} // Remove Employee
                className="dropdown-option remove-employee"
            >
                Remove Employee
            </button>
            {/* Edit Role Dropdown */}
            <div className="role-edit mt-2">
                <select
                    value={employee.role}
                    onChange={(e) => handleRoleChange(employee._id, e.target.value)}
                    className="role-select"
                >
                    {['Team Lead', 'Team Lead Coordinator', 'Supervisor', 'SPS', 'Senior SPS', 'Specimen Accessioner'].map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const renderRotationSelection = () => (
        <div className="rotation-list">
            {availableRotations.map((rotation) => (
                <label key={rotation} className="rotation-item">
                    <input
                        type="checkbox"
                        checked={employee.trainedRotations.includes(rotation)}
                        onChange={(e) => handleRotationChange(employee._id, rotation, e.target.checked)}
                    />
                    <span>{rotation}</span>
                </label>
            ))}
            <button
                onClick={() => setEditingRotations(false)} // Go back to main menu
                className="back-button"
            >
                Back
            </button>
        </div>
    );

    return (
        <li key={employee._id} className={`employee-card ${cardColor}`}>
            <div className="employee-header">
                <strong>{employee.firstName} {employee.lastName}</strong>

                <button onClick={handleToggleDropdown} className="dropdown-button">
                <span className={`dropdown-icon ${openDropdown === employee._id ? 'rotate' : ''}`}>▼</span>
                </button>
            </div>

            {/* Render Dropdown Menu */}
            {openDropdown === employee._id && !editingRotations && renderDropdownMenu()}

            {/* Render Rotation Selection Menu */}
            {openDropdown === employee._id && editingRotations && renderRotationSelection()}
        </li>
    );
};
