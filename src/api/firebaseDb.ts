import { firebaseConfig } from "./fireConfig";
import Firebase from "firebase";

const fire:Firebase.app.App = Firebase.initializeApp(firebaseConfig);
const db: Firebase.firestore.Firestore = fire.firestore();

Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);

//eslint-disable-next-line no-restricted-globals
if(location.hostname === "localhost") {
    
    /* Comment these lines to use the firebase in the cloud */
    
    db.settings({
        host: "localhost:8081",
        ssl: false
    })
}

const funcs = fire.functions();


export function startFirebase() {
    console.log("starting Firebase");
}

export { db, funcs };