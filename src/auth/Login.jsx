
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Eye, EyeOff } from "lucide-react";

function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (err) {
      console.error("Login failed:", err);

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Unable to sign in. Please try again.");
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

      <h2>Welcome back</h2>
      <p className="auth-subtitle">
        Sign in to access your support workspace.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
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

        <label className="password-field">
            Password

            <div className="password-input-wrap">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
            </div>
        </label>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button className="primary-button auth-submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="auth-switch">
        New to HelpDesk?{" "}
        <button type="button" onClick={onSwitch}>Create an account</button>
      </p>
    </section>
  );
}

export default Login;
