import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, firestore } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
const useAuth = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider.setCustomParameters({ prompt: 'select_account' }));
      const user = result.user;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        });

        // uniquely creating the pantry
        const userPantryDocRef = doc(firestore, `users/${user.uid}/pantry/`, "default");
        await setDoc(userPantryDocRef, {});
      }

      localStorage.setItem("loggedIn", JSON.stringify(user));
      router.push("/home");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("loggedIn");
      console.log("User signed out");
      router.push("/");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const authListener = (setUser) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
        localStorage.setItem("loggedIn", JSON.stringify(user));
      } else {
        setUser(false);
        localStorage.removeItem("loggedIn");
      }
    });
  };

  return { signInWithGoogle, signOutUser, authListener };
};

export default useAuth;
