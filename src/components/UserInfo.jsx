import React, { useState, useEffect } from 'react';
import './UserInfo.css';

function UserInfo() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // Default sort by name

  useEffect(() => {
    // Load search history from local storage on component mount
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedHistory);
  }, []);

  const saveSearch = () => {
    // Save the search term to local storage and update state
    const updatedHistory = [...searchHistory, searchTerm];
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
    setSearchTerm('');
  };

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setSortedUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      saveSearch(); // Call saveSearch function when a search is performed
      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSortedUsers(filteredUsers);
    } else {
      setSortedUsers(users); // Reset to display all users if search term is empty
    }
  };

  const handleSort = (criteria) => {
    let sorted;
    if (criteria === 'name') {
      sorted = [...sortedUsers].sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'email') {
      sorted = [...sortedUsers].sort((a, b) => a.email.localeCompare(b.email));
    } else if (criteria === 'phone') {
      sorted = [...sortedUsers].sort((a, b) => a.phone.localeCompare(b.phone));
    }
    setSortedUsers(sorted);
    setSortBy(criteria);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="user-info-container">
      <h1 className="user-info-header">User Information</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="search-history">
        <h2>Search History:</h2>
        <ul>
          {searchHistory.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
        <button onClick={clearSearchHistory}>Clear History</button>
      </div>
      <div className="sort-options">
        <h2>Sort By:</h2>
        <button className={sortBy === 'name' ? 'active' : ''} onClick={() => handleSort('name')}>Name</button>
        <button className={sortBy === 'email' ? 'active' : ''} onClick={() => handleSort('email')}>Email</button>
        <button className={sortBy === 'phone' ? 'active' : ''} onClick={() => handleSort('phone')}>Phone</button>
      </div>
      <ul className="user-list">
        {sortedUsers.map(user => (
          <li key={user.id} className="user-item">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserInfo;
 