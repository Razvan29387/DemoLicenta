import React, { useState, useEffect } from 'react';
import JobTable from '../components/JobTable';
import Pagination from '../components/Pagination';

const JobsPage = () => {
  // Inițializăm starea direct din LocalStorage dacă există date salvate
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('cached_jobs');
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  // Loading-ul apare doar dacă NU avem nimic în cache
  const [loading, setLoading] = useState(jobs.length === 0);
  
  // State pentru paginare Joburi
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [jobsPerPage] = useState(10);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        // Fetching from our local backend API via proxy
        const response = await fetch('/jobs');
        
        if (!response.ok) {
             throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        
        // Actualizăm starea și salvăm în LocalStorage pentru data viitoare
        setJobs(data);
        localStorage.setItem('cached_jobs', JSON.stringify(data));
        
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Calculăm joburile pentru pagina curentă
  const indexOfLastJob = currentJobPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Funcție pentru a schimba pagina la joburi
  const paginateJobs = (pageNumber) => setCurrentJobPage(pageNumber);

  // Afișăm loading doar dacă nu avem niciun job (nici din cache, nici de pe server)
  if (loading && jobs.length === 0) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div>
      <h1>Joburi</h1>
      <JobTable jobs={currentJobs} />
      <Pagination itemsPerPage={jobsPerPage} totalItems={jobs.length} paginate={paginateJobs} currentPage={currentJobPage} />
    </div>
  );
};

export default JobsPage;