import { Button } from "@material-ui/core"
import React, { FC, useState } from "react"
import { Command } from "../../models/Commands"
import { doRemoveCommand } from "../../services/commands/SystemCommands";




const CancelCommandButton: FC<{command: Command}> = (props) => {
    const [clicked, setClicked] = useState<boolean>(false);
    
    function cancel() {
        setClicked(true);
        doRemoveCommand(props.command.id);
    }

    return <Button variant="contained" color="secondary" disabled={clicked} onClick={cancel}>Cancel</Button>
}

export default CancelCommandButton;