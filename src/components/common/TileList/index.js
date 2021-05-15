import React from 'react';
import * as PropTypes from 'prop-types';

import { Button } from 'reactstrap';

const TileList = ({
  name,
  list = [],
  onSelect,
  defaultValue,
  gapsSize = 2,
}) => {
  return (
    <div className="w-100 overflow-auto">
      {name ? <p className="py-2">{name}</p> : null}
      <div className={`d-flex pt-${gapsSize} pl-${gapsSize}`}>
        {list.map((listItem, index) => {
          const { name, value, content, disabled } = listItem;
          const isSelected = value === defaultValue;

          return (
            <Button
              color={isSelected ? 'primary' : 'light'}
              className={`mr-${gapsSize} mb-${gapsSize} ${
                isSelected ? 'bg-primary' : 'bg-white'
              }`}
              key={index}
              value={value}
              name={name}
              disabled={disabled}
              onClick={() => onSelect({ ...listItem, id: value })}>
              {content ? content : name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

TileList.propTypes = {
  displayName: PropTypes.string,
  list: PropTypes.array,
  onSelect: PropTypes.func,
  defaultValue: PropTypes.string,
  gapsSize: PropTypes.number,
};

export { TileList };
