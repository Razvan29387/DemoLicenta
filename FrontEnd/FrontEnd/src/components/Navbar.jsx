import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 }}>
        <li>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>Dashboard</Link>
        </li>
        <li>
          <Link to="/firme" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>Firme</Link>
        </li>
        <li>
          <Link to="/jobs" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>Joburi</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;