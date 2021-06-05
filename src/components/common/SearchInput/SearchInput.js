import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import { Search } from 'react-feather';
import styled from 'styled-components';

import { getIsShowSearchSpinner } from 'selectors';
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
  requestSearch,
  searchText,
  placeholder,
  searchRef,
  customClass = '',
}) => {
  const [searchValue, setSearchValue] = useState('');
  const isShowSearchSpinner = useSelector(getIsShowSearchSpinner);

  const onChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (searchText !== value && (value.length < 1 || value.length > 2)) {
      requestSearch(value);
    }
  };

  const onEnter = (e) => {
    if (e.key === ENTER && searchText !== searchValue) {
      requestSearch(searchValue);
    }
  };

  const clearSearchText = () => {
    if (searchRef?.current?.value) {
      searchRef.current.value = '';
    }
    requestSearch('');
  };

  return (
    <div className={`search-container ${customClass}`}>
      <Search className="search-icon" />
      {isShowSearchSpinner && (
        <div className="lds-spinner position-absolute">
          {[...Array(12).keys()].map((s) => (
            <span key={s} />
          ))}
        </div>
      )}
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
