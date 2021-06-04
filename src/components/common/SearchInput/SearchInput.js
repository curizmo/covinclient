import React, { useState } from 'react';
import { Input } from 'reactstrap';
import { Search } from 'react-feather';
import styled from 'styled-components';

import xIcon from 'assets/images/svg-icons/x-icon.svg';
import { ENTER } from '../../../constants';

const XButton = styled.button`
  background-color: #9fa7ba;
  border-radius: 50%;
  border: none;
  position: absolute;
  top: 0;
  right: 0.625rem;
  transform: translate3d(0, 50%, 0);
  height: 22px;
  width: 22px;
`;
const XIcon = styled.img`
  position: absolute;
  top: bottom;
  right: 0;
  transform: translate3d(-50%, -50%, 0);
  height: 11px;
  width: 11px;
`;

export const SearchInput = ({
  setSearchText,
  searchText,
  placeholder,
  searchRef,
  customClass = '',
}) => {
  const [searchValue, setSearchValue] = useState('');

  const onChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if ((value.length < 1 || value.length > 2) && searchText !== value) {
      setSearchText(value);
    }
  };

  const onEnter = (e) => {
    if (e.key === ENTER && searchText !== searchValue) {
      setSearchText(searchValue);
    }
  };

  const clearSearchText = () => {
    if (searchRef?.current?.value) {
      searchRef.current.value = '';
    }
    setSearchText('');
  };

  return (
    <div className={`search-container ${customClass}`}>
      <Search className="search-icon" />
      <Input
        innerRef={searchRef}
        className="search-input"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={onEnter}
      />
      <XButton
        onClick={clearSearchText}
        disabled={searchRef?.current?.value?.length < 1}>
        <XIcon src={xIcon} alt="x-icon" />
      </XButton>
    </div>
  );
};
