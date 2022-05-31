import { FC, Fragment, ReactNode } from 'react';
import { Translation, useTranslator } from './translator';

type Placeholders = {
    [key: string]: string | ReactNode;
};

type TextWithPlaceholdersProps = {
    text: string;
    placeholders: Placeholders;
};

const TextWithPlaceholders: FC<TextWithPlaceholdersProps> = (props) => {
    const placeholderKeys = Object.keys(props.placeholders);
    if (!placeholderKeys.length) {
        return <>{props.text}</>;
    }
    const placeholderKey = placeholderKeys[0];
    const placeholderValue = props.placeholders[placeholderKey];
    let nextPlaceholders: Placeholders = { ...props.placeholders };
    delete nextPlaceholders[placeholderKey];
    const textParts = props.text.split(`{{${placeholderKey}}}`);
    const textPartsWithPlaceholders: ReactNode[] = textParts.map((textPart) => (
        <TextWithPlaceholders text={textPart} placeholders={nextPlaceholders} />
    ));
    return (
        <>
            {textPartsWithPlaceholders.reduce((prev, curr, index) => {
                return [
                    <Fragment key={'prev' + index}>{prev}</Fragment>,
                    <Fragment key={'placeholder' + index}>{placeholderValue}</Fragment>,
                    <Fragment key={'curr' + index}>{curr}</Fragment>,
                ];
            })}
        </>
    );
};

export type TProps = Omit<Translation, 'placeholders'> & {
    placeholders?: Placeholders;
};

export const T: FC<TProps> = (props) => {
    const { t } = useTranslator();
    const text = t(props.id);
    if (!props.placeholders) {
        return <>{text}</>;
    }
    return <TextWithPlaceholders text={text} placeholders={props.placeholders} />;
};
