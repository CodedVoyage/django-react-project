import React from 'react';
import { FormFieldProps } from '../../types';
import './FormField.css';

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  required = false,
}) => {
  return (
    <div className="form-field">
      <label className={`form-field-label ${required ? 'form-field-required' : ''}`}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className="form-field-input">
        {children}
      </div>
      {error && <div className="form-field-error">{error}</div>}
    </div>
  );
};

export default FormField;