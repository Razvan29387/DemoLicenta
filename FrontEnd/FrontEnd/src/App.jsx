import { useState, useEffect } from 'react'
import './App.css'
import PersonManagement from './components/PersonManagement';
import FirmTable from './components/FirmTable';
import Pagination from './components/Pagination';
import JobTable from './components/JobTable';

function App() {
  const [firms, setFirms] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Adăugăm o stare pentru încărcare
  
  // State pentru paginare
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State pentru paginare Joburi
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [jobsPerPage] = useState(10);

  useEffect(() => {
    const loadAllFirms = async () => {
      try {
        const response = await fetch('/firme');
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setFirms(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load firms:", err);
      } finally {
        setIsLoading(false); // Oprim starea de încărcare, indiferent de rezultat
      }
    };

    const loadJobs = async () => {
      try {
        // Fetching from our local backend API (populated by AdzunaIngestionService)
        const response = await fetch('/jobs');
        
        if (!response.ok) {
             throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    };

    loadAllFirms();
    loadJobs();
  }, []); // [] asigură că se execută o singură dată, la montarea componentei

  // Calculăm firmele pentru pagina curentă
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFirms = firms.slice(indexOfFirstItem, indexOfLastItem);

  // Calculăm joburile pentru pagina curentă
  const indexOfLastJob = currentJobPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Funcție pentru a schimba pagina
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Funcție pentru a schimba pagina la joburi
  const paginateJobs = (pageNumber) => setCurrentJobPage(pageNumber);

  return (
    <>
      <PersonManagement />
      <hr />
      {error ? (
        <p className="error">Error loading firms: {error}</p>
      ) : (
        <>
          <FirmTable firms={currentFirms} isLoading={isLoading} />
          <Pagination itemsPerPage={itemsPerPage} totalItems={firms.length} paginate={paginate} currentPage={currentPage} />
        </>
      )}
      <hr />
      <JobTable jobs={currentJobs} />
      <Pagination itemsPerPage={jobsPerPage} totalItems={jobs.length} paginate={paginateJobs} currentPage={currentJobPage} />
    </>
  )
}

export default App
