import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Job not found');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;

  const companyName = job.company?.name || job.company?.display_name || 'N/A';
  const category = typeof job.category === 'string' ? job.category : (job.category?.label || 'N/A');
  const location = typeof job.location === 'string' ? job.location : (job.location?.display_name || 'N/A');
  const applyUrl = job.url || job.redirect_url || '#';

  return (
    <div className="job-details-container">
      <Link to="/jobs" className="back-link">← Back to Jobs</Link>
      
      <div className="job-header">
        <h1>{job.title}</h1>
        <div className="job-meta">
          <span className="company">{companyName}</span>
          <span className="location">📍 {location}</span>
          <span className="category">🏷️ {category}</span>
        </div>
      </div>

      <div className="job-content">
        <div className="job-description">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-actions">
          <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="apply-button">
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;