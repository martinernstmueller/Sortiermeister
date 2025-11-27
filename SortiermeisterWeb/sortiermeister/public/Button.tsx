import React from 'react';

type ButtonProps = {
    onClick: () => void;
    label: string;
    title?: string;
    className: string;
};

function createTitle(title?: string): string {
    return title ? title : 'Default title';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, title }) => (
    <button onClick={onClick} title={createTitle(title)}>
        {label}
    </button>
);

export default Button;