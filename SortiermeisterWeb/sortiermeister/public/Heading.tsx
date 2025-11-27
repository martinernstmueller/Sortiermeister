import React from 'react';

type HeadingProps = {
    label: string;
    title?: string;
};

const Heading: React.FC<HeadingProps> = ({ label, title }) => (
    <h1 {...(title ? { title } : {})}>
        {label}
    </h1>
);

export default Heading;