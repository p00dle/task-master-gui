import * as React from 'react';

interface ButtonParams {
  onClick?: () => any;
  className?: string;
  disabled?: boolean;
  text?: string;
  children?: any;
}
export const Button: React.FC<ButtonParams> = function Button({
  onClick = () => undefined,
  className = '',
  children,
  text,
  disabled = false,
}) {
  const content = children || text || '';
  return (
    <button className={'btn ' + className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};
