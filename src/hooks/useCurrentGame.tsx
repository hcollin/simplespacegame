import { useService } from "jokits-react";
import { GameModel } from "../models/Models";
import { SERVICEID } from "../services/services";


export default function useCurrentGame(): GameModel|undefined {

    const [game] = useService<GameModel>(SERVICEID.GameService);

    return game;
}