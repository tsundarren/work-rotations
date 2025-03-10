'use client';

import { useState, useEffect } from 'react';
import Modal from './components/Modal';  // Import the Modal component
import { AddEmployeeForm } from './components/AddEmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { AssignmentGrid } from './components/AssignmentGrid';

// Define the available rotations and days of the week
const availableRotations = [
  'BN', 'Expeditor', 'Blue Bag', 'Manual 1', 'Manual 2/Pack-up', 'Prisma SPL', 'Prisma Tracking', 'Making Shipment Boxes', 
  'Setting Up BN Shipment', 'Prisma TOUCH', 'Prisma Frozen', 'Weights', 'TOUCH', 'Micro', 'Cyto 1', 'Cyto 2', 'QFT', 
  'SPN/SORT/SCAN', 'Histo/Frozens Matchup', 'Frozen Helper', 'REF', 'Breath Bag/Novant/Pack up', 'PHC', 'Ref Match-Up', 'Floater', 
  'Biohazard', 'Clean Sweep', 'Imaging', 'Nightly Report', 'Verify BN IRR', 'DST/LAB-IN-THE BOX', 'Schedule Board', 'Disinfection Log'
];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const groupedRotations = {
  Manual: ['Manual 1', 'Manual 2/Pack-up'],
  Cyto: ['Cyto 1', 'Cyto 2'],
};

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trainedRotations, setTrainedRotations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [assignments, setAssignments] = useState(getInitialAssignments);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility

  // Helper function to get initial assignments structure
  function getInitialAssignments() {
    const initialAssignments = {};
    availableRotations.forEach(rotation => {
      initialAssignments[rotation] = daysOfWeek.reduce((acc, day) => {
        acc[day] = '';
        return acc;
      }, {});
    });
    return initialAssignments;
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/getEmployees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
      setError('Failed to load employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRotationSelection = (rotation) => {
    setTrainedRotations(prev => (
      prev.includes(rotation) ? prev.filter(r => r !== rotation) : [...prev, rotation]
    ));
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
        body: JSON.stringify({ firstName, lastName, trainedRotations, role }),
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

  const openModal = () => {
    setIsModalOpen(true);  // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  const handleRotationChange = async (employeeId, rotation, checked) => {
    try {
      const updatedEmployee = employees.find(emp => emp._id === employeeId);
      const newTrainedRotations = checked
        ? [...updatedEmployee.trainedRotations, rotation]
        : updatedEmployee.trainedRotations.filter(r => r !== rotation);

      await fetch(`/api/updateEmployee/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainedRotations: newTrainedRotations }),
      });
      fetchEmployees();
    } catch (err) {
      console.error('Failed to update rotations:', err);
    }
  };

  const handleAssignmentChange = async (rotation, day, employeeId) => {
    const previousAssignments = { ...assignments };

    // Optimistically update assignments
    setAssignments(prev => ({
      ...prev,
      [rotation]: { ...prev[rotation], [day]: employeeId || '' }
    }));

    try {
      const response = await fetch(`/api/updateAssignment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotation, day, employeeId }),
      });

      if (!response.ok) throw new Error('Failed to update assignment');
    } catch (err) {
      console.error('Error updating assignment:', err);
      setAssignments(previousAssignments);
    }
  };

  const removeEmployee = async (employeeId) => {
    try {
      const response = await fetch(`/api/removeEmployee/${employeeId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove employee.');
      setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to remove employee. Please try again later.');
    }
  };

  return (
    <div className="container">
      <button onClick={openModal} className="open-modal-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
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
      </Modal>

      <EmployeeList
        employees={employees}
        setEmployees={setEmployees}
        availableRotations={availableRotations}
        handleRotationChange={handleRotationChange}
        removeEmployee={removeEmployee}
      />

      <AssignmentGrid
        assignments={assignments}
        employees={employees}
        setEmployees={setEmployees}
        availableRotations={availableRotations}
        daysOfWeek={daysOfWeek}
        handleAssignmentChange={handleAssignmentChange}
        groupedRotations={groupedRotations}
      />
    </div>
  );
}
