import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { app } from "./firebase";
import { db } from "./firestore";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { db };
