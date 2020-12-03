import { Button } from "@material-ui/core";
import { DeleteForever, PlayArrow } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import { apiListGames } from "../api/apiGame";
import DataTable, { ColumnProps } from "../components/DataTable";
import MenuPageContainer from "../components/MenuPageContainer";
import { GameModel, GameState } from "../models/Models";

const AdminPage: FC = () => {
	const [games, setGames] = useState<GameModel[]>([]);

	useEffect(() => {
		async function loadGames() {
			const gs = await apiListGames();
			console.log(gs);
			if (gs) {
				setGames(gs);
			}
		}
		loadGames();
    }, []);
    
    function deleteGame(gameId: string) {
        console.log("Delete game", gameId);
    }

    function processGame(gameId: string) {
        console.log("Process turn for game", gameId);
    }

	const columns: ColumnProps[] = [
		{
			key: "name",
			size: 100,
			header: "Name",
		},
		{
			key: "turn",
			size: 60,
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
			key: "id",
			size: 200,
			header: "Actions",
			fn: (item: GameModel) => (
				<>
					<Button variant="contained" color="secondary" style={{margin: "0 0.25rem"}} startIcon={<DeleteForever />} onClick={() => deleteGame(item.id)}>
						Delete
					</Button>
                    <Button variant="contained" color="primary" style={{margin: "0 0.25rem"}} startIcon={<PlayArrow />} onClick={() => processGame(item.id)}>
						Process
					</Button>
				</>
			),
		},
	];

	return (
		<MenuPageContainer title="Frost Galaxt">
			<section>
				<header>
					<h2>All current games</h2>
				</header>

				<DataTable columns={columns} rows={games} />
			</section>
		</MenuPageContainer>
	);
};

export default AdminPage;
