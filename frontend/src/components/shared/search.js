import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const SearchField = ({title, placeholderText, setSearchQuery}) => {
  return (
    <div className='card'>
      <div className='input-group'>
        <div className='input-group-prepend'>
          <span className='input-group-text'>{title}:</span>
        </div>
        <input
          className='form-control'
          type='text'
          placeholder={placeholderText}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

const SearchRangeField = ({title, low, high}) => {
  return (
    <div className='card'>
      <div className='input-group'>
        <div className='input-group-prepend'>
          <span className='input-group-text'>{title}:</span>
        </div>
        <input
          className='form-control'
          type='text'
          placeholder={low.placeholderText}
          value={low.searchQuery}
          onChange={(e) => low.setSearchQuery(e.target.value)}
        />
        <input
          className='form-control'
          type='text'
          placeholder={high.placeholderText}
          value={high.searchQuery}
          onChange={(e) => high.setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export {
  SearchField,
  SearchRangeField
};
