import React, { FC } from "react";

interface Props {
    repeats: number;
    children: any;
}

const Repeat: FC<Props> = (props) => {
    const repArr: string[] = [];

    for (let i = 0; i < props.repeats; i++) {
        repArr.push(`ind-${i}`);
    }

    return (
        <>
            {repArr.map((id: string) => {
                return <span key={id}>{props.children}</span>;
            })}
        </>
    );
};

export default Repeat;
