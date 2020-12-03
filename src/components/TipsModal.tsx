import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC, useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {},
	}),
);

const TipsModal: FC = () => {
    const classes = useStyles();

    const [tipIndex, setTipIndex] = useState<number>(0);

    const tip = Tips[tipIndex];
    

	return <div className={classes.root}>
        <header>
            <h3>Tip</h3>
            <h1>{tip.title}</h1>

        </header>

        <section>
            <p>{tip.text}</p>
        </section>

    </div>;
};

export default TipsModal;



interface Tip {
    text: string;
    title: string;
}


const Tips: Tip[] = [
    {
        title: "Remember to setup research!",
        text: "Remember to check the research settings on your first turn!",
    }
]