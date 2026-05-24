import useSignup from "@hooks/useSignup";
import styles from "./LoginSignUp.module.css";

function SignUp({ setMode, rememberMe, setRememberMe }) {
  const {
    handleSignUp,
    username,
    setUsername,
    password,
    setPassword,
    confirmedPassword,
    setConfirmedPassword,
    generalError,
  } = useSignup();
  return (
    <section className={styles.container}>
      <h1>Sign Up</h1>
      {errors.fieldsAreEmpty && (
        <p className={styles.error}>* Please fill in all fields</p>
      )}
      <form className={styles.formsContainer} onSubmit={handleSignUp}>
        <div className={styles.field}>
          <label>Username </label>
          <input
            type="text"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
          {errors.usernameIsAlreadyTaken && (
            <p className={styles.error}>*Username is already in use</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Password </label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            placeholder="at least 8 characters"
          />
          {errors.passwordUnderEightCharacters && (
            <p className={styles.error}>* Password is under 8 characters</p>
          )}
        </div>
        <div className={styles.field}>
          <label>{"Password (again)"}</label>
          <input
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            type="password"
          />
          {errors.passwordsDoNotMatch && (
            <p className={styles.error}>* Passwords do not match</p>
          )}
        </div>
        <span className={styles.submitAndReminder}>
          <button type="submit">Sign Up</button>
          <span className={styles.rememberMe}>
            <label htmlFor="remember-me">Remember me</label>
            <input
              type="checkbox"
              onChange={() => setRememberMe((prev) => !prev)}
            />
          </span>
          <p>
            Already have an account?{" "}
            <a onClick={() => setMode("login")}>Log in here</a>
          </p>
        </span>
      </form>
    </section>
  );
}

export default SignUp;
