import React from 'react';

const JobTable = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return <p>No jobs loaded yet.</p>;
  }

  return (
    <div className="job-table-container">
      <h2>Jobs List (Fetched from Database)</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Category</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            // Handle data from Backend Entity (or fallback to raw Adzuna structure)
            const companyName = job.company?.name || job.company?.display_name || 'N/A';
            const category = typeof job.category === 'string' ? job.category : (job.category?.label || 'N/A');
            const location = typeof job.location === 'string' ? job.location : (job.location?.display_name || 'N/A');
            const applyUrl = job.url || job.redirect_url || '#';

            return (
            <tr key={job.id || Math.random()}>
              <td>{job.title}</td>
              <td>{companyName}</td>
              <td>{category}</td>
              <td>{location}</td>
              <td>
                <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                  Apply
                </a>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;