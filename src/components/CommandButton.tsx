import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {}
    }));

interface Props {
    children?: any;
    price?: number;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

const CommandButton: FC<Props> = (props) => {
    const classes = useStyles();

    return <div className={`${classes.root} ${props.className || ""}`}>
        {props.price && <p className="price">{props.price}</p>}
        <Button variant="contained" color="primary" onClick={props.onClick} disabled={props.disabled !== undefined ? props.disabled : false}>{props.children}</Button>
    </div>
}

export default CommandButton;