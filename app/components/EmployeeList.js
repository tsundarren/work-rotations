import { useState } from 'react';
import { EmployeeCard } from './EmployeeCard';
import '../styles/EmployeeList.css'; // Import the CSS file

export const EmployeeList = ({ employees, setEmployees, availableRotations, handleRotationChange, removeEmployee }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (employeeId) => {
        setOpenDropdown(openDropdown === employeeId ? null : employeeId);
    };

    const handleRoleChange = async (employeeId, newRole) => {
        try {
            const response = await fetch(`/api/updateEmployee/${employeeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Employee role updated:', data);
                setEmployees((prevEmployees) =>
                    prevEmployees.map((emp) =>
                        emp._id === employeeId ? { ...emp, role: newRole } : emp
                    )
                );
            } else {
                console.error('Error updating role:', data);
            }
        } catch (err) {
            console.error('Failed to update role. Please try again later.', err);
        }
    };

    const renderEmployeeList = () => (
        <ul className="employee-list">
            {employees.map((employee) => (
                <EmployeeCard
                    key={employee._id}
                    employee={employee}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    handleRotationChange={handleRotationChange}
                    removeEmployee={removeEmployee}
                    availableRotations={availableRotations}
                    handleRoleChange={handleRoleChange}
                />
            ))}
        </ul>
    );

    return (
        <div>
            <h2 className="section-title">Employees</h2>
            {employees.length > 0 ? renderEmployeeList() : <p>No employees found.</p>}
        </div>
    );
};
