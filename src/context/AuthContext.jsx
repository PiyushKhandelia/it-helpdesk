
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const authVersion = useRef(0);
  const profileVersion = useRef(0);

  async function loadProfile(currentUser, { retry = false } = {}) {
    const authRequest = authVersion.current;
    const profileRequest = ++profileVersion.current;

    setLoading(true);
    setProfileError("");

    try {
      const attempts = retry ? 3 : 1;

      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const snapshot = await getDoc(
          doc(db, "users", currentUser.uid)
        );

        if (
          authRequest !== authVersion.current ||
          profileRequest !== profileVersion.current
        ) {
          return null;
        }

        if (snapshot.exists()) {
          const data = snapshot.data();

          if (data.uid !== currentUser.uid) {
            throw new Error(
              "The Firestore profile UID does not match the signed-in account."
            );
          }

          setProfile(data);
          return data;
        }

        if (attempt < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      setProfile(null);
      setProfileError(
        "No HelpDesk profile was found for this account. Please check the Firestore users document."
      );

      return null;
    } catch (error) {
      if (
        authRequest === authVersion.current &&
        profileRequest === profileVersion.current
      ) {
        console.error("Unable to load HelpDesk profile:", error);
        setProfile(null);
        setProfileError(error.message || "Unable to load the profile.");
      }

      throw error;
    } finally {
      if (
        authRequest === authVersion.current &&
        profileRequest === profileVersion.current
      ) {
        setLoading(false);
      }
    }
  }

  async function refreshProfile(currentUser = auth.currentUser) {
    if (!currentUser) {
      setProfile(null);
      setProfileError("");
      setLoading(false);
      return null;
    }

    return loadProfile(currentUser, { retry: true });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      authVersion.current += 1;
      profileVersion.current += 1;

      setUser(currentUser);
      setProfile(null);
      setProfileError("");

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        await loadProfile(currentUser);
      } catch {
        // loadProfile records the error in profileError.
      }
    });

    return () => {
      authVersion.current += 1;
      profileVersion.current += 1;
      unsubscribe();
    };
  }, []);

  async function logout() {
    // Invalidate pending profile reads before signing out.
    authVersion.current += 1;
    profileVersion.current += 1;

    setProfile(null);
    setProfileError("");
    setLoading(true);

    try {
      await signOut(auth);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileError,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
