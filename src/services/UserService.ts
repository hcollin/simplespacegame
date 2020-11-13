import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import DATAUSERS from "../data/dataUser.";
import { User } from "../models/User";

import Firebase from "firebase";

export default function createUserService(serviceId: string, api: JokiServiceApi): JokiService<User | null> {
    let user: User | null = null;

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "login":
                    console.error("INVALID LOGIN CALL!");
                    // login(event.data);
                    break;
                case "switch":
                    switchUser(event.data);
                    break;
                case "logout":
                    break;
                case "loginWithGoogle":
                    loginWithGoogle();
                    break;
                case "loginAsDev":
                    if (typeof event.data === "number") {
                        switchUser(DATAUSERS[event.data].id);
                    } else {
                        switchUser(DATAUSERS[0].id);
                    }

                    break;
            }
        }
    }

    // function login(userName: string) {
    //     const usr = DATAUSERS.find((u: User) => u.login === userName);
    //     if (usr) {
    //         user = usr;
    //         sendUpdate();
    //     }
    // }

    function switchUser(userId: string) {
        const usr = DATAUSERS.find((u: User) => u.id === userId);
        if (usr) {
            api.api.setAtom<string>("UserLoginState", "LOGGEDIN");
            user = usr;
            sendUpdate();
        }
    }

    async function loginWithGoogle() {
        const provider = new Firebase.auth.GoogleAuthProvider();
        await Firebase.auth().signInWithRedirect(provider);
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
    api.api.setAtom<string>("UserLoginState", "PROCESSING");
    Firebase.auth().getRedirectResult().then((result: Firebase.auth.UserCredential) => {
        console.log("RESULTS", result);
        
        if (result === null) {
            
            user = null;
            api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
            sendUpdate();
        } else {
            if (result.user) {
                api.api.setAtom<string>("UserLoginState", "LOGGEDIN");
                const u: User = {
                    id: result.user.uid,
                    name: result.user.displayName || "No name",
                    email: result.user.email || "no email",
                }
                user = u;
                sendUpdate();
            } else {
                api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
            }
        }
    });

    return {
        eventHandler,
        getState,
    };
}
