import React from 'react';

type BoxProps = {
  num: number;
  color: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

const Box: React.FC<BoxProps> = ({ num, color, active, onClick, className }) => (
  <div
    className={`box${active ? ' active' : ''}${className ? ' ' + className : ''}`}
    style={{ backgroundColor: color, borderRadius: '10px' }}
    onClick={onClick}
  >
    <span>{num}</span>
  </div>
);

export default Box;