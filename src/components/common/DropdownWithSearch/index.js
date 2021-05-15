import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const DropdownWithSearch = ({ list, onSelect, label = '' }) => {
  const [options, setOptions] = useState([]);

  const onChange = (event) => {
    onSelect(event.target.value);
  };

  useEffect(() => {
    if (list.length > 0) {
      setOptions(list);
    }
  }, [list]);

  return (
    <div>
      {label ? <p>{label}</p> : null}
      <Input type="select" onChange={onChange} onBlur={onChange}>
        <option key="default" value="" className="d-none">
          Search...
        </option>
        {options.map(({ value, name }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </Input>
    </div>
  );
};

DropdownWithSearch.propTypes = {
  list: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  widthClass: PropTypes.string,
};

export { DropdownWithSearch };
