import React from 'react';
import { Input } from 'reactstrap';
import { Search } from 'react-feather';

export const SearchInput = ({
  searchText,
  placeholder,
  onChange,
  searchRef,
  customClass = '',
}) => {
  return (
    <div className={`search-container ${customClass}`}>
      <Search className="search-icon" />
      <Input
        innerRef={searchRef}
        className="search-input"
        type="text"
        placeholder={placeholder}
        defaultValue={searchText}
        onChange={onChange}
      />
    </div>
  );
};
