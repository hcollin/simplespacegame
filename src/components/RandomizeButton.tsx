import React, { FC } from "react";
import { Button, ButtonProps, Tooltip } from "@material-ui/core"
import CasinoIcon from "@material-ui/icons/Casino";

interface Props extends ButtonProps {
    toolTip?: string;
}

const RandomizeButton: FC<Props> = (props) => {

    const {toolTip, ...rest} = props;

    if(toolTip) {
        return <Tooltip title={toolTip}>
           <Button {...rest}><CasinoIcon /></Button> 
        </Tooltip>
    }

    return <Button {...rest}><CasinoIcon /></Button>
}

export default RandomizeButton;