import React from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";

const SearchField = ({ title, placeholderText, setSearchQuery }) => {
  return (
    <>
      <InputGroup className="mb-3">
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

const SearchRangeField = ({ title, low, high }) => {
  return (
    <>
      <InputGroup className="mb-3">
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

const SearchDateField = ({ selectedDate, handleDateChange }) => {
  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text>Date:</InputGroup.Text>
        <Form.Control
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </InputGroup>
    </>
  );
};

const SearchDropdownField = ({
  title,
  options,
  selectedOption,
  handleOptionChange,
}) => {
  return (
    <>
    <InputGroup className="mb-3">
        <InputGroup.Text>{title}:</InputGroup.Text>
        <Dropdown onSelect={handleOptionChange}>
          <Dropdown.Toggle>
            {selectedOption || 'Select an option'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {options.map((option) => {
              return <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
            })}
          </Dropdown.Menu>
        </Dropdown>
    </InputGroup>
    </>
  );
};

export { SearchField, SearchRangeField, SearchDateField, SearchDropdownField };
