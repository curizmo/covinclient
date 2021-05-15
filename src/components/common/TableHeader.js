import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { ChevronDown, ChevronUp } from 'react-feather';
import { SORT_ORDER } from '../../constants/index';

const TableHeader = ({
  header,
  sortField,
  setSortField,
  setCurrentPage,
  title,
}) => {
  const getSortIcon = useCallback(
    (header) => {
      if (header?.colName === sortField?.colName) {
        if (sortField?.sortOrder === SORT_ORDER.Ascending) {
          return <ChevronUp key={header?.colName} size={15} />;
        }
        return <ChevronDown key={header?.colName} size={15} />;
      }
    },
    [header],
  );

  const handleOnClick = () => {
    setCurrentPage(0);
    const field = {
      colName: header?.colName,
      sortOrder:
        header?.colName !== sortField?.colName
          ? SORT_ORDER.Ascending
          : sortField?.sortOrder === SORT_ORDER.Ascending
          ? SORT_ORDER.Descending
          : SORT_ORDER.Ascending,
    };
    setSortField(field);
  };

  return (
    <>
      <th onClick={setCurrentPage && handleOnClick}>
        <span>{title}</span>
        {header ? <span className="chevron">{getSortIcon(header)}</span> : null}
      </th>
    </>
  );
};

TableHeader.propTypes = {
  header: PropTypes.object,
  sortField: PropTypes.object,
  setSortField: PropTypes.func,
  setCurrentPage: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default TableHeader;
