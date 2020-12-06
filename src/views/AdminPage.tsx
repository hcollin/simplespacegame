import { Button, ButtonGroup, LinearProgress } from "@material-ui/core";
import { DeleteForever, PlayArrow, Stop } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import { apiDeleteChatsForGame } from "../api/apiChat";
import { apiDeleteCommandsForGame } from "../api/apiCommands";
import { apiDeleteGame, apiListGames, apiUpdateGame } from "../api/apiGame";
import { apiDeleteReportsForGame } from "../api/apiReport";
import { apiLoadUsers } from "../api/apiUser";
import DataTable, { ColumnProps } from "../components/DataTable";
import MenuPageContainer from "../components/MenuPageContainer";
import { GameModel, GameState } from "../models/Models";
import { User } from "../models/User";
import { userIsAdmin, userIsBlocked } from "../utils/userUtils";

const AdminPage: FC = () => {
    const [adminView, setAdminView] = useState<string>("games");

    return (
        <MenuPageContainer title="Frost Galaxy">
            <section>
                <header>
                    <h2>All current games</h2>
                </header>

                <ButtonGroup variant="contained">
                    <Button color={adminView === "games" ? "primary" : "default"} onClick={() => setAdminView("games")}>
                        Games
                    </Button>
                    <Button color={adminView === "users" ? "primary" : "default"} onClick={() => setAdminView("users")}>
                        Users
                    </Button>
                </ButtonGroup>

                <hr />
                {adminView === "games" && <AdminGames />}
                {adminView === "users" && <AdminUsers />}
            </section>
        </MenuPageContainer>
    );
};

const AdminGames: FC = () => {
    const [games, setGames] = useState<GameModel[]>([]);

    const [processing, setProcessing] = useState<boolean | string>(false);

    useEffect(() => {
        async function loadGames() {
            setProcessing("Loading Games");
            const gs = await apiListGames();
            if (gs) {
                setGames(gs);
            }
            setProcessing(false);
        }
        loadGames();
    }, []);

    function deleteGame(game: GameModel) {
        console.log("Delete game", game.name);

        async function startDeletingProcess() {
            setProcessing("Deleting chat");
            await apiDeleteChatsForGame(game.id);

            setProcessing("Deleting reports");
            await apiDeleteReportsForGame(game.id);

            setProcessing("Deleting commands");
            await apiDeleteCommandsForGame(game.id);

            setProcessing("Deleting game");
            await apiDeleteGame(game);

            setProcessing("Loading updated game list");
            const gs = await apiListGames();
            setGames(gs);

            setProcessing(false);
        }

        startDeletingProcess();
    }

    function closeGame(game: GameModel) {
        async function stop() {
            setProcessing(true);

            game.state = GameState.CLOSED;
            await apiUpdateGame(game);
            setProcessing(false);
        }

        stop();
    }

    function processGame(gameId: string) {
        console.log("Process turn for game", gameId);
    }

    const columns: ColumnProps[] = [
        {
            key: "id",
            size: 100,
            header: "Game Id",
        },
        {
            key: "name",
            size: 100,
            header: "Name",
        },
        {
            key: "turn",
            size: 50,
            header: "Turn",
        },
        {
            key: "factions",
            size: 80,
            header: "Players Ready",
            fn: (item: GameModel) => (
                <span>
                    {item.factionsReady.length} / {item.factions.length}
                </span>
            ),
        },
        {
            key: "state",
            size: 100,
            header: "State",
            fn: (item: GameModel) => <span>{GameState[item.state]}</span>,
        },
        {
            key: "actions",
            size: 200,
            header: "Actions",
            fn: (item: GameModel) => (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ margin: "0 0.25rem" }}
                        startIcon={<DeleteForever />}
                        onClick={() => deleteGame(item)}
                    >
                        Delete
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ margin: "0 0.25rem" }}
                        startIcon={<Stop />}
                        onClick={() => closeGame(item)}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: "0 0.25rem" }}
                        startIcon={<PlayArrow />}
                        onClick={() => processGame(item.id)}
                    >
                        Process
                    </Button>
                </>
            ),
        },
    ];
    if (processing) return <Processing text={typeof processing === "string" ? processing : undefined} />;
    return <DataTable columns={columns} rows={games} />;
};

const AdminUsers: FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [processing, setProcessing] = useState<boolean | string>(false);
    useEffect(() => {
        async function loadUsers() {
            setProcessing("Loading Users");
            const usrs = await apiLoadUsers();

            if (usrs) {
                setUsers(usrs);
            }
            setProcessing(false);
        }
        loadUsers();
    }, []);

    const columns: ColumnProps[] = [
        {
            key: "name",
            header: "Name",
            size: 100,
        },
        {
            key: "email",
            header: "Email",
            size: 150,
        },
        {
            key: "isAdmin",
            header: "Admin?",
            size: 80,
            fn: (item: User) => (userIsAdmin(item) ? "YES" : "NO"),
        },
        {
            key: "isBlocked",
            header: "Blocked?",
            size: 80,
            fn: (item: User) => (userIsBlocked(item) ? "YES" : "NO"),
        },
    ];
    if (processing) return <Processing text={typeof processing === "string" ? processing : undefined} />;

    return <DataTable columns={columns} rows={users} />;
};

interface ProcessingProps {
    text?: string;
}

const Processing: FC<ProcessingProps> = (props) => {
    return (
        <div style={{ textAlign: "center", padding: "1rem", fontSize: "2rem" }}>
            <LinearProgress />
            {props.text && <p>{props.text}</p>}
        </div>
    );
};

export default AdminPage;
