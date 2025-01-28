'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trainedRotations, setTrainedRotations] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees on component mount
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
      setError('Failed to load employees. Please try again later.');
      setLoading(false);
    }
  };

  // Handle form submission to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!firstName.trim() || !lastName.trim() || !trainedRotations.trim()) {
      setError('Please provide first name, last name, and trained rotations.');
      return;
    }

    setError(''); // Clear previous error
    try {
      const response = await fetch('/api/addEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          trainedRotations: trainedRotations.split(',').map((r) => r.trim()),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh employee list after adding
        fetchEmployees();
        // Clear the form
        setFirstName('');
        setLastName('');
        setTrainedRotations('');
      } else {
        setError(data.message || 'Failed to add employee. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Rotation Assignment</h1>

      {/* Add Employee Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Employee</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Trained Rotations (comma-separated)"
            value={trainedRotations}
            onChange={(e) => setTrainedRotations(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Employee
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Display Employees */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Employees</h2>
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length > 0 ? (
          <ul className="list-disc list-inside">
            {employees.map((employee) => (
              <li key={employee._id}>
                <strong>{employee.firstName} {employee.lastName}</strong> - Trained Rotations: {employee.trainedRotations.join(', ')}
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
