import React, { useState, useEffect } from 'react';
import './Searchbar.scss';
import { Link } from 'react-router-dom';

const SearchBar = ({ onFocus, onBlur }) => {
  const [url, setUrl] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    setUrl(window.location.pathname);
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const validation = (e) => {
    e.stopPropagation();
    if (!value) {
      alert("Introduzir a ocorrência");
      return;
    }
  };

  return (
    <div className="search-bar-container">
      <div className="input-group">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={onFocus} // Call onFocus prop when search bar is focused
          onBlur={onBlur}   // Call onBlur prop when search bar loses focus
          className="form-control"
          placeholder="Pesquisar ocorrência aqui"
        />
        <div className="input-group-append" onClick={validation}>
          {value ? (
            <Link to={`/search/${value}`}>
              <button className="btn btn-secondary" type="button">
                <i className="fa fa-search"></i>
              </button>
            </Link>
          ) : (
            <Link to={`${url}`}>
              <button className="btn btn-secondary" type="button">
                <i className="fa fa-search"></i>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
