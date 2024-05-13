import React, { useState } from 'react';
import searchIcon from '../../assets/search.png'


export const SearchBar = ({ onSearch }) => {

  const [searchQuery, setSearchQuery] = useState('Search for nearby place...');
  const [visible, setVisible] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
    setSearchQuery(''); // Clear the input after searching
  };

  const handleFocus = () => {
    setSearchQuery('');
  }

  return (
    <div style={{
        position: 'absolute',
        top: '50px',
        left: '250px',
        height: '23px',
        width: '190px',
        backgroundColor: 'rgb(59, 59, 59, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        color: 'var(--offWhite)',
        fontFamily: "Nunito"
      }} 
      className={`search-bar`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search for nearby place..."
        style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            height: '18px',
          }} 
      />
      <button style={{
        position: 'absolute',
        top: '6px',
        left: '165px',
        height: '22px',
        padding: '4px',
        width: '28px',
      }} 
      onClick={handleSearch}>
        <img className="search-bar-icon" src={searchIcon} alt="Search" />
        </button>
    </div>
  );
};