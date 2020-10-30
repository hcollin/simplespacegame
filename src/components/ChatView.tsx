import { makeStyles, Theme, createStyles, Button, TextField } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import { ChatMessage } from "../models/Communication";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getFactionById } from "../utils/factionUtils";



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

            "& > div.messages": {
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                height: "20rem",
                overflowY: "auto",

                "& > div.message": {
                    margin: "0.5rem 0",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#FFFA",
                    color: "black",
                    borderRadius: "1rem",
                    fontSize: "1rem",
                    border: "solid 1px #0004",

                    "& > p": {
                        // padding: 0,
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#000",
                        background: "#DDD8",
                        padding: "0.25rem",
                        borderRadius: "0.5rem",
                        marginTop: "0.25rem",
                        // textShadow: "1px 1px 1px white, -1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white"
                    },
                    "& > label": {
                        padding: 0,
                        margin: "0 0 0.25rem 0",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        opacity: 0.75,
                    },

                    "&.mymessage": {
                        borderBottomRightRadius: 0,
                        marginLeft: "5rem",
                    },
                    "&.answer": {
                        borderBottomLeftRadius: 0,
                        marginRight: "5rem",
                    }

                }
            },
            "& > div.newmessage": {
                margin: "1rem 0",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",

                "& > div": {
                    flex: "1 1 auto",
                    marginRight: "1rem",
                },
                "& > button": {
                    flex: "0 0 auto",
                }

            }
        }
    }));

interface ChatViewProps {
    other: string;
    className?: string;
}
const ChatView: FC<ChatViewProps> = (props) => {
    const classes = useStyles();
    const [allmsgs, action] = useService<ChatMessage[]>("ChatService")
    const faction = useCurrentFaction();

    const [newmsg, setNewmsg] = useState<string>("");


    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if(faction && allmsgs !== undefined) {
            setMessages(allmsgs.filter((msg: ChatMessage) => {
                if(props.other === "_GLOBAL" && msg.to === "_GLOBAL") {
                    return true;
                }
                return (props.other === msg.from && msg.to === faction.id) || (props.other === msg.to && msg.from === faction.id);
            }));
        }
    }, [allmsgs, faction, props.other]);

    if (!allmsgs || !faction) return null;
   

    function sendNewMessage() {
        action("send", { msg: newmsg || "Testing 123", to: props.other });
        setNewmsg("");
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewmsg(event.target.value);
    };

    return <div className={`${classes.root} ${props.className || ""}`}>
        <div className="messages">
            {messages.map((msg: ChatMessage) => {
                const mymsg = msg.from === faction.id;
                let color = "#FFFA";
                let from = "Global";
                const at = new Date(msg.sent).toLocaleString();
                if(mymsg) {
                    color = faction.color;
                    from = faction.name;
                } else {
                    console.log(msg.from);
                    if(msg.from !== "_GLOBAL") {
                        const fromFaction = getFactionById(msg.from);
                        from = fromFaction.name;
                        color = fromFaction.color;
                    }
                    

                }
                


                return (
                    <div className={`message ${mymsg ? "mymessage" : "answer"}`} key={msg.id} style={{backgroundColor: color}}>
                        <label>{from} @ {at}</label>
                        <p>{msg.message}</p>
                    </div>
                )
            })}
        </div>
        <div className="newmessage">

            <TextField label="New message" variant="outlined" value={newmsg} onChange={handleChange} /> <Button variant="contained" color="primary" onClick={sendNewMessage}>Send</Button>
        </div>
    </div>

}


export default ChatView;