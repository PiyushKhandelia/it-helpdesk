
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

function Register({ onSwitch }) {
  const { refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        displayName: name.trim(),
        email: credential.user.email,
        role: "employee",
        createdAt: serverTimestamp(),
      });

      const profile = await refreshProfile(credential.user);

      if (!profile || profile.uid !== credential.user.uid) {
        setError(
          "Your account was created, but the HelpDesk profile could not be loaded. Please sign in again or check your Firestore rules."
        );
        return;
      }

      // AuthContext will detect the signed-in user.
    
    } catch (err) {
      console.error("Registration failed:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Choose a stronger password.");
      } else if (
        err.code === "permission-denied" ||
        err.code === "firestore/permission-denied"
      ) {
        setError(
          "Your account was created, but its profile could not be saved. Please check your Firestore rules and try signing in again."
        );
      } else {
        setError(
          err.message ||
          "Registration failed. Please try again."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-card">
      <div className="auth-brand">
        <div className="brand-icon">
          <span>H</span>
        </div>
        <h1>HelpDesk</h1>
        <p>IT Incident Management</p>
      </div>

      <h2>Create your account</h2>
      <p className="auth-subtitle">
        Register as an employee to get started.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Full name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button className="primary-button auth-submit" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already registered?{" "}
        <button type="button" onClick={onSwitch}>Sign in</button>
      </p>
    </section>
  );
}

export default Register;
