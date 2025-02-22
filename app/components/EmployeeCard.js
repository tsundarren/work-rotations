import { useState } from 'react';

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
        <div className="dropdown-overlay absolute bg-white shadow-lg z-20 mt-2 w-48 p-2 border rounded-md">
            <button
                onClick={() => setEditingRotations(true)} // Show Edit Rotations menu
                className="dropdown-option w-full text-left px-2 py-1 hover:bg-gray-200"
            >
                Edit Rotations
            </button>
            <button
                onClick={() => removeEmployee(employee._id)} // Remove Employee
                className="dropdown-option w-full text-left px-2 py-1 hover:bg-red-200"
            >
                Remove Employee
            </button>
            {/* Edit Role Dropdown */}
            <div className="role-edit mt-2">
                <select
                    value={employee.role}
                    onChange={(e) => handleRoleChange(employee._id, e.target.value)}
                    className="w-full text-left px-2 py-1"
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
        <div className="rotation-list absolute bg-white shadow-lg z-20 mt-2 w-48 p-2 border rounded-md">
            {availableRotations.map((rotation) => (
                <label key={rotation} className="flex items-center space-x-2 p-1">
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
                className="dropdown-option bg-gray-200 hover:bg-gray-300 w-full p-1 mt-2 text-center rounded"
            >
                Back
            </button>
        </div>
    );

    return (
        <li key={employee._id} className={`employee-card relative ${cardColor}`}>
            <div className="employee-header flex justify-between items-center">
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
