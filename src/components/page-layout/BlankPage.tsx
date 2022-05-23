import React, { FC, ReactNode, useEffect } from 'react';
import { useConfig } from '@packages/core/config';

export type BlankPageProps = {
    title: string;
    children?: ReactNode;
};

export const BlankPage: FC<BlankPageProps> = (props) => {
    const { companyName } = useConfig();
    const titleParts: string[] = [];
    if (props.title) {
        titleParts.push(props.title);
    }
    if (companyName) {
        titleParts.push(companyName);
    }
    useEffect(() => {
        document.title = titleParts.join(' :: ');
    });
    return <>{props.children}</>;
};
