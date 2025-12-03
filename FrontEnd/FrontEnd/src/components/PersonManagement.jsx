import React, { useState, useEffect } from 'react';

const API_URL = '/persons';

function PersonManagement() {
  const [persons, setPersons] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    age: '',
    gender: ''
  });

  // Load all persons on component mount
  useEffect(() => {
    loadAllPersons();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000); // Hide after 3s
  };

  const clearForm = () => {
    setFormData({ name: '', email: '', address: '', phone: '', age: '', gender: '' });
  };

  const loadAllPersons = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      showMessage(`Could not load person list: ${error.message}`, 'error');
    }
  };

  const handleSelectPerson = (person) => {
    setFormData(person);
    setIsFormVisible(true);
  };

  const addPerson = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age) || 0 })
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      showMessage(`Person '${formData.name}' added successfully.`, 'success');
      clearForm();
      loadAllPersons();
      setIsFormVisible(false);
    } catch (error) {
      showMessage(`Error adding person: ${error.message}`, 'error');
    }
  };

  const updatePerson = async () => {
     try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(formData.name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age) || 0 })
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      showMessage(`Person '${formData.name}' updated successfully.`, 'success');
      clearForm();
      loadAllPersons();
    } catch (error) {
      showMessage(`Error updating person: ${error.message}`, 'error');
    }
  };

  const deletePerson = async () => {
    if (!formData.name || !window.confirm(`Are you sure you want to delete '${formData.name}'?`)) return;
    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(formData.name)}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      showMessage(`Person '${formData.name}' deleted successfully.`, 'success');
      clearForm();
      loadAllPersons();
    } catch (error) {
      showMessage(`Error deleting person: ${error.message}`, 'error');
    }
  };

  const findPerson = async () => {
    if (!formData.name) {
        showMessage('Please enter a name to find.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(formData.name)}`);
        if (response.ok) {
            const person = await response.json();
            if (person) {
                setFormData(person);
                showMessage(`Found person '${formData.name}'.`, 'success');
                setIsFormVisible(true);
            } else {
                 showMessage(`Person '${formData.name}' not found.`, 'error');
                 clearForm(); // Golește formularul dacă persoana nu a fost găsită
            }
        } else {
            throw new Error(`Server responded with ${response.status}`);
        }
    } catch (error) {
         showMessage(`Error finding person: ${error.message}`, 'error');
    }
  };


  return (
    <div className="management-container">
      <h1>Person Management</h1>
      <div className="page-controls">
        <button onClick={() => { setIsFormVisible(!isFormVisible); clearForm(); }}>
          {isFormVisible ? 'Hide Form' : 'Add New Person'}
        </button>
      </div>

      {isFormVisible && (
        <div id="form-wrapper">
          <div className="form-grid">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter name (ID)" value={formData.name} onChange={handleInputChange} />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />

            <label htmlFor="address">Address:</label>
            <input type="text" id="address" placeholder="Enter address" value={formData.address} onChange={handleInputChange} />

            <label htmlFor="phone">Phone:</label>
            <input type="text" id="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleInputChange} />

            <label htmlFor="age">Age:</label>
            <input type="number" id="age" placeholder="Enter age" value={formData.age} onChange={handleInputChange} />

            <label htmlFor="gender">Gender:</label>
            <input type="text" id="gender" placeholder="Enter gender" value={formData.gender} onChange={handleInputChange} />
          </div>

          <div className="button-group">
            <button onClick={addPerson}>Add Person</button>
            <button onClick={updatePerson}>Update Person</button>
            <button onClick={deletePerson}>Delete Person</button>
            <button onClick={findPerson}>Find Person by Name</button>
          </div>

          {message.text && <div id="message" className={message.type}>{message.text}</div>}
        </div>
      )}

      <hr />

      <h2>All Persons</h2>
      <ul id="person-list">
        {persons.map(person => (
          <li key={person.id || person.name} onClick={() => handleSelectPerson(person)}>
            {person.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PersonManagement;