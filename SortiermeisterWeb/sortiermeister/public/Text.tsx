import React, { ReactNode, ElementType } from 'react';

type TextProps = {
    children: ReactNode;
    title?: string;
    as?: ElementType;
    className?: string;
    style?: React.CSSProperties;
};

const Text: React.FC<TextProps> = ({
    children,
    title,
    as: Tag = 'span',
    className,
    style,
}) => {
    return (
        <Tag {...(title ? { title } : {})} className={className} style={style}>
            {children}
        </Tag>
    );
};

export default Text;