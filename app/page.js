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
  const [role, setRole] = useState('');

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
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide first name and last name.');
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
          role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchEmployees();
        setFirstName('');
        setLastName('');
        setTrainedRotations([]);
        setRole('');
      } else {
        setError(data.message || 'Failed to add employee. Please try again.');
      }
    } catch (err) {
      console.error('Something went wrong:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleRotationChange = async (employeeId, rotation, checked) => {
    try {
      const updatedEmployee = employees.find(emp => emp._id === employeeId);
      const newTrainedRotations = checked
        ? [...updatedEmployee.trainedRotations, rotation]
        : updatedEmployee.trainedRotations.filter(r => r !== rotation);
  
      // If the new trained rotations array is empty, allow it to be empty
      const response = await fetch(`/api/updateEmployee/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainedRotations: newTrainedRotations.length > 0 ? newTrainedRotations : [],
        }),
      });
  
      if (!response.ok) throw new Error('Failed to update employee.');
  
      // Refresh employees after update
      fetchEmployees();
    } catch (err) {
      console.error('Failed to update rotations:', err);
    }
  };
  
  

  const handleAssignmentChange = async (rotation, day, employeeId) => {
    setAssignments(prev => ({
      ...prev,
      [rotation]: {
        ...prev[rotation],
        [day]: employeeId || ''
      }
    }));
  
    try {
      const response = await fetch(`/api/updateAssignment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotation, day, employeeId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }
    } catch (err) {
      console.error('Error updating assignment:', err);
    }
  };
  

  const getUnassignedEmployees = () => {
    return employees.filter(employee => employee.assignedRotations.length === 0);
  };
  
  

  const removeEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/removeEmployee/${employeeId}`, {
        method: 'DELETE',
      });
      const text = await response.text();
      if (!response.ok) {
        console.error('Error removing employee:', text);
        alert('Failed to remove employee. Please try again later.');
        return;
      }
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
        role={role}
        setRole={setRole}
      />
      <EmployeeList
        employees={employees}
        setEmployees={setEmployees}
        availableRotations={availableRotations}
        handleRotationChange={handleRotationChange}
        removeEmployee={removeEmployee}
      />
      <UnassignedEmployeesTable unassignedEmployees={getUnassignedEmployees()} />
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
