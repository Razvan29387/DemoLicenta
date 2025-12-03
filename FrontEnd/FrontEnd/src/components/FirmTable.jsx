import React from 'react';

function FirmTable({ firms, isLoading }) {
  if (isLoading) {
    return <p>Loading firms...</p>;
  }

  if (!firms || firms.length === 0) {
    return <p>No firms found.</p>;
  }

  return (
    <div className="management-container">
      <h2>All Firms</h2>
      <table id="firma-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {firms.map((firm) => (
            <tr key={firm.id || firm.name}>
              <td>{firm.name}</td>
              <td>{firm.address}</td>
              <td>{firm.phone}</td>
              <td>{firm.email}</td>
              <td><a href={firm.website} target="_blank" rel="noopener noreferrer">{firm.website}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FirmTable;