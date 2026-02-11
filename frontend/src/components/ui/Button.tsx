import React from 'react';
import { ButtonProps } from '../../types';
import './Button.css';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const getButtonClasses = () => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const disabledClass = disabled || loading ? 'btn-disabled' : '';
    const fullWidthClass = fullWidth ? 'btn-full-width' : '';
    
    return `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${fullWidthClass} ${className}`.trim();
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="spinner"></span>
          Loading...
        </span>
      ) : (
        <>
          {startIcon && <span className="btn-icon btn-start-icon">{startIcon}</span>}
          <span className="btn-content">{children}</span>
          {endIcon && <span className="btn-icon btn-end-icon">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;