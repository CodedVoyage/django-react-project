import React from 'react';
import { ButtonProps } from '../../types';
import './Button.css';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${disabled || loading ? 'btn-disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="spinner"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;