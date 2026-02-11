import React from 'react';
import { InputProps } from '../../types';
import './Input.css';

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-wrapper">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;