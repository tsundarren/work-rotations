'use client';

import { useEffect, useState } from 'react';
import './styles.css';

import { AddEmployeeForm } from './components/AddEmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { UnassignedEmployeesTable } from './components/UnassignedEmployeesTable';
import { AssignmentGrid } from './components/AssignmentGrid';

const availableRotations = [
  'BN', 'Expeditor', 'Blue Bag', 'Manual 1', 'Prisma SPL',
  'Prisma Tracking', 'Making Shipment Boxes', 'Setting Up BN Shipment', 'Prisma TOUCH', 'Prisma Frozen',
  'Weights', 'TOUCH', 'Micro', 'Cyto', 'QFT',
  'SPN/SORT/SCAN', 'Histo/Frozens Matchup', 'REF', 'Breath Bag/Novant/Pack up', 'PHC',
  'Ref Match-Up', 'Floater', 'Biohazard', 'Clean Sweep', 'Imaging',
  'Nightly Report', 'Verify BN IRR', 'DST/LAB-IN-THE BOX', 'Schedule Board', 'Disinfection Log'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trainedRotations, setTrainedRotations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState(() => {
    const initialAssignments = {};
    availableRotations.forEach(rotation => {
      initialAssignments[rotation] = {};
      daysOfWeek.forEach(day => {
        initialAssignments[rotation][day] = '';
      });
    });
    return initialAssignments;
  });

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

  const handleAssignmentChange = (rotation, day, employeeId) => {
    setAssignments(prev => ({
      ...prev,
      [rotation]: {
        ...prev[rotation],
        [day]: employeeId
      }
    }));
  };

  const getUnassignedEmployees = () => {
    const assignedEmployeeIds = new Set();
    Object.values(assignments).forEach(rotation => {
      Object.values(rotation).forEach(employeeId => {
        if (employeeId) {
          assignedEmployeeIds.add(employeeId);
        }
      });
    });

    return employees.filter(employee => !assignedEmployeeIds.has(employee._id));
  };

  const removeEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/removeEmployee/${employeeId}`, {
        method: 'DELETE',
      });
  
      // Check if response is empty before parsing JSON
      const text = await response.text(); // Get raw response text
      console.log('Raw response:', text);
  
      if (!response.ok) {
        console.error('Error removing employee:', text);
        alert('Failed to remove employee. Please try again later.');
        return;
      }
  
      // Only parse JSON if there's content
      const data = text ? JSON.parse(text) : {};
      console.log('Employee removed:', data);
  
      // Update the state to remove the employee from the list
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== employeeId)
      );
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to remove employee. Please try again later.');
    }
  };
  
  return (
    <div className="container">
      <h1 className="heading">Employee Rotation Assignment</h1>

      <AddEmployeeForm
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        trainedRotations={trainedRotations}
        handleRotationSelection={handleRotationSelection}
        handleSubmit={handleSubmit}
        error={error}
        availableRotations={availableRotations}
      />

      <EmployeeList
        employees={employees}
        setEmployees={setEmployees}
        availableRotations={availableRotations}
        handleRotationChange={handleRotationChange}
        removeEmployee={removeEmployee} // Correctly passing removeEmployee prop
      />

      <UnassignedEmployeesTable
        unassignedEmployees={getUnassignedEmployees()}
      />

      <AssignmentGrid
        assignments={assignments}
        employees={employees}
        availableRotations={availableRotations}
        daysOfWeek={daysOfWeek}
        handleAssignmentChange={handleAssignmentChange}
      />
    </div>
  );
}
