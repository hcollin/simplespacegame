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
					logout();
					break;
				case "loginWithGoogle":
					loginWithGoogle();
					break;
				case "loginEmailPasswd":
					loginWithEmailAndPassword(event.data.email, event.data.passwd);
					break;
				case "registerEmailPassword":
					registerWithEmailAndPassword(event.data.email, event.data.passwd, event.data.name);
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

	async function logout() {
		api.api.setAtom<string>("UserLoginState", "PROCESSING");
		await Firebase.auth().signOut();
		user = null;
		api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
		sendUpdate();
	}

	async function loginWithGoogle() {
		await Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
		const provider = new Firebase.auth.GoogleAuthProvider();
		await Firebase.auth().signInWithRedirect(provider);
	}

	async function loginWithEmailAndPassword(email: string, password: string) {
		await Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
		const result = await Firebase.auth().signInWithEmailAndPassword(email, password);
		await checkUserCredentials(result);
	}

	async function registerWithEmailAndPassword(email: string, password: string, name: string) {
		try {
            api.api.setAtom<string>("UserLoginState", "PROCESSING");
			await Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
			const result = await Firebase.auth().createUserWithEmailAndPassword(email, password);

			if (result.user) {
				await result.user.updateProfile({
					displayName: name,
				});

				await checkUserCredentials(result);
			} else {
                api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
            }
		} catch (e) {
            console.error("Could not register", e);
            api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
		}
	}

	async function checkUserCredentials(result: Firebase.auth.UserCredential): Promise<Firebase.User | null> {
		if (result === null) {
			user = null;
			api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
			sendUpdate();
		} else {
			if (result.user) {
				return setUser(result.user);
			} else {
				api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
			}
		}
		return null;
	}

	function setUser(firebaseUser: Firebase.User): Firebase.User {
		api.api.setAtom<string>("UserLoginState", "LOGGEDIN");
		const u: User = {
			id: firebaseUser.uid,
			name: firebaseUser.displayName || "No name",
			email: firebaseUser.email || "no email",
		};
		user = u;
		sendUpdate();
		return firebaseUser;
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

	Firebase.auth().onAuthStateChanged((user: Firebase.User | null) => {
		if (user) {
			console.log("Auth State Changed!", user);
			setUser(user);
		} else {
			console.log("Auth State Changed!", user);
			api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
		}
	});

	// Firebase.auth()
	// 	.getRedirectResult()
	// 	.then((result: Firebase.auth.UserCredential) => {
	// 		console.log("RESULTS", result);

	// 		if (result === null) {
	// 			user = null;
	// 			api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
	// 			sendUpdate();
	// 		} else {
	// 			if (result.user) {
	// 				api.api.setAtom<string>("UserLoginState", "LOGGEDIN");
	// 				const u: User = {
	// 					id: result.user.uid,
	// 					name: result.user.displayName || "No name",
	// 					email: result.user.email || "no email",
	// 				};
	// 				user = u;
	// 				sendUpdate();
	// 			} else {
	// 				api.api.setAtom<string>("UserLoginState", "ANONYMOUS");
	// 			}
	// 		}
	// 	});

	return {
		eventHandler,
		getState,
	};
}
