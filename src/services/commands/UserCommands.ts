import { joki } from "jokits-react";
import { SERVICEID } from "../services";



export function doLogout() {

    joki.trigger({
        to: SERVICEID.UserService,
        action: "logout",
    });

}


export function doCloseGame() {

    joki.trigger({
        to: SERVICEID.GameService,
        action: "closeGame",
    });

}