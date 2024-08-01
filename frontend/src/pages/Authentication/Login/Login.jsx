import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import "./Login.css";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const token1 = localStorage.getItem("token1");
    if (token) {
      navigate("/");
    } else if (token1) {
      console.log("token1 exist");
      navigate("/admin/dashboard/");
    }
  }, [navigate]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const validation = () => {
    setUserNameError("");
    setPasswordError("");

    if ("" === username) {
      setUserNameError("Please enter your username");
      return false;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return false;
    }

    if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return false;
    }

    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("admin called", e.target.name);
    if (validation()) {
      axios
        .post("http://localhost:3000/userLogin", { username, password, isAdmin: e.target.name === 'admin' })
        .then((res) => {
          if (res.data.user) {
            setSnackbarMessage("Login successful");
            setSnackbarOpen(true);
            setTimeout(() => {
              if (e.target.name === "admin") {
                localStorage.setItem("token1", res.data.user);
                navigate("/admin/dashboard/");
              } else {
                localStorage.setItem("token", res.data.user);
                navigate("/");
              }
              onLoginSuccess(true);
            }, 3000)
          } else {
            setSnackbarMessage("Check your username and password");
            setSnackbarOpen(true);
          }
        }).catch((err) => {
          console.log("err is", err)
          setSnackbarMessage(err.response.data.message || "An error occurred");
          setSnackbarOpen(true);
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 3000)
          setUsername("");
          setPassword("");
        });
    }
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Conecte-se</div>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={username}
          placeholder="Nome de usuário"
          onChange={(ev) => setUsername(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{userNameError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={password}
          type="password"
          placeholder="Senha"
          onChange={(ev) => setPassword(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div
        style={{ flexDirection: "row", gap: "20px" }}
        className={"inputContainer"}
      >
        <input
          className="inputButton btn btn-primary px-5 py-2 text-center"
          type="button"
          onClick={(e) => handleLogin(e)}
          value="Faça login como usuário"
          name="user"
        />
        <input
          className="inputButton btn btn-primary px-5 py-2 text-center"
          type="button"
          onClick={(e) => handleLogin(e)}
          name="admin"
          value="Faça login como administrador"
        />
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successful') ? 'success' : 'error'} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
