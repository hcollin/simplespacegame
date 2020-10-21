import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import DATAUSERS from "../data/dataUser.";
import { User } from "../models/User";

export default function createUserService(serviceId: string, api: JokiServiceApi): JokiService<User | null> {
    let user: User | null = null;

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "login":
                    login(event.data);
                    break;
                case "switch":
                    switchUser(event.data);
                    break;
                case "logout":
                    break;
            }
        }
    }

    function login(userName: string) {
        const usr = DATAUSERS.find((u: User) => u.login === userName);
        if (usr) {
            user = usr;
            sendUpdate();
        }
    }

    function switchUser(userId: string) {
        const usr = DATAUSERS.find((u: User) => u.id === userId);
        if (usr) {
            user = usr;
            sendUpdate();
        }
    }

    function getState(): User | null {
        if (user === null) {
            return null;
        }
        return { ...user };
    }

    function sendUpdate() {
        if (user === null) {
            api.updated(null);
        } else {
            api.updated({ ...user });
        }
    }

    setTimeout(() => {
        user = DATAUSERS[0];
        sendUpdate();
        
    }, 500);

    return {
        eventHandler,
        getState,
    };
}
