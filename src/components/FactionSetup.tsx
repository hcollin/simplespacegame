import { makeStyles, Theme, createStyles, TextField, Select, MenuItem, Button, Box, Grid } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import React, { FC, useState } from "react";
import { FACTION_FONTS, FACTION_NAMES } from "../configs";
import { FactionSetup } from "../models/Models";
import { randomFactionName } from "../services/helpers/FactionHelpers";
import { arnd } from "../utils/randUtils";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        part: {
            margin: "1rem 0",

            "& .row": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                "& > div": {
                    padding: "0.5rem",
                    flex: "1 1 auto",
                    "& > label": {
                        margin: "0.25rem 0",
                    }

                }
            },

            "& > div": {
                margin: "1rem 0",
            },

            "& .field": {

            },

            "& .info": {
                padding: "1rem",
            }

        }
    }));







const FactionSetupView: FC = () => {
    const classes = useStyles();

    const [setup, setSetup] = useState<FactionSetup>({
        name: "",
        color: "",
        fontFamily: "Arial",
        iconFileName: "abstract-001.svg",
    });

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSetup((prev: FactionSetup) => {
            prev.name = event.target.value;
            return { ...prev };
        })
    };

    const handleFontChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSetup((prev: FactionSetup) => {
            prev.fontFamily = event.target.value as string;
            return { ...prev };
        })
    };

    function randomName() {
        setSetup((prev: FactionSetup) => {
            prev.name = `${arnd(FACTION_NAMES[0])} ${arnd(FACTION_NAMES[1])} ${arnd(FACTION_NAMES[2])}`;
            return { ...prev };

        })
    }


    return (
        <div className={classes.part}>
            <h2>Faction setup</h2>
            <Grid container>
                <Grid lg={4} spacing={8}>
                    <div className="info">
                        <InputLabel>Faction Name</InputLabel>
                        <TextField value={setup.name} onChange={handleNameChange} fullWidth={true} />
                        <Button onClick={randomName} variant="contained">Random</Button>
                    </div>

                    <div  className="info">
                        <InputLabel id="faction-font-label">Age</InputLabel>
                        <Select value={setup.fontFamily} labelId="faction-font-label" onChange={handleFontChange}>
                            <MenuItem value="Arial">Arial</MenuItem>
                            {FACTION_FONTS.map((ff: string) => <MenuItem value={ff} key={ff}>{ff}</MenuItem>)}
                        </Select>
                    </div>
                </Grid>
                <Grid lg={8}>
                    <div className="info">
                        <h1 style={{fontFamily: setup.fontFamily}}>{setup.name}</h1>
                    </div>

                </Grid>
            </Grid>


        </div>
    )

}

export default FactionSetupView;