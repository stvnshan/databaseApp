import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const SearchField = ({title, placeholderText, setSearchQuery}) => {
  return (
    <>
      <InputGroup classname="mb-3">
        <InputGroup.Text>{title}:</InputGroup.Text>
        <Form.Control
          placeholder={placeholderText}
          aria-label={placeholderText}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
    </>
  );
};

const SearchRangeField = ({title, low, high}) => {
  return (
    <>
      <InputGroup classname="mb-3">
        <InputGroup.Text>{title}:</InputGroup.Text>
        <Form.Control
          placeholder={low.placeholderText}
          aria-label={low.placeholderText}
          onChange={(e) => low.setSearchQuery(e.target.value)}
        />
        <Form.Control
          placeholder={high.placeholderText}
          aria-label={high.placeholderText}
          onChange={(e) => high.setSearchQuery(e.target.value)}
        />
      </InputGroup>
    </>
  );
};

export {
  SearchField,
  SearchRangeField
};
