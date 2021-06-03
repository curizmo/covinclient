import React from 'react';
import * as PropTypes from 'prop-types';
import { FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';

import { GRID_COLUMNS_NUMBER } from 'constants/index';

const InputField = (props) => {
  const {
    inline = false,
    labelSize = 2,
    required = false,
    name,
    title,
    type = 'text',
    customClass = '',
    invalid = '',
    error = '',
    placeholder = '',
    ...rest
  } = props;

  const input = (
    <>
      <div className="position-relative">
        <Input
          {...rest}
          id={name}
          type={type}
          name={name}
          invalid={!!(invalid || error)}
          placeholder={placeholder}
          className={`${customClass} ${
            ['checkbox', 'radio'].includes(type) ? 'ml-0' : ''
          }`}
        />
        <span />
        <FormFeedback>{error}</FormFeedback>
      </div>
    </>
  );

  return inline ? (
    <FormGroup row>
      {title && (
        <Label for={name} sm={labelSize} className={required ? 'required' : ''}>
          {title}
        </Label>
      )}
      <Col sm={GRID_COLUMNS_NUMBER - (title ? labelSize : 0)}>{input}</Col>
    </FormGroup>
  ) : (
    <FormGroup className={type === 'radio' ? 'd-flex mb-0 p-0 mr-2' : ''}>
      {title && (
        <Label
          for={name}
          className={
            required ? 'required' : type === 'radio' ? 'd-flex mb-0 ml-3' : ''
          }>
          {type === 'file' ? (
            <div className="btn btn-primary">{title}</div>
          ) : (
            title
          )}
        </Label>
      )}
      {input}
    </FormGroup>
  );
};

InputField.propTypes = {
  inline: PropTypes.bool, // flag to determine if label and input should display inline
  labelSize: PropTypes.number, // if inline is true, can use labelSize to adjust label and input size
  title: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  onChange: PropTypes.func,
  customClass: PropTypes.string,
  invalid: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  error: PropTypes.string,
  children: PropTypes.node,
  placeholder: PropTypes.string,
};

export { InputField };
