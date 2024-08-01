import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { jwtDecode } from "jwt-decode";

const Login = ({ onLogout }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token1");
    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        localStorage.removeItem("token1");
        navigate("/login");
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, []);

  const validation = () => {
    setUserNameError("");
    setPasswordError("");
    setDesignationError("");

    // Check if the user has entered both fields correctly
    if ("" === username) {
      setUserNameError("Please enter your username");
      return false;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return false;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return false;
    }
    if (designation.length < 7) {
      setDesignationError("The designation must be 8 characters or longer");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validation()) {
      axios
        .post("http://localhost:3000/admin/dashboard/registerUser", {
          username,
          password,
          designation,
        })
        .then((res) => {
          console.log(res.data);
          setSubmitStatus("success");
          setSnackbarMessage("Submitted successfully");
          setSnackbarOpen(true);
          setTimeout(() => {
            setSubmitStatus(null);
          }, 2000);
          setUserName("");
          setDesignation("");
          setPassword("");
        })
        .catch((err) => {
          console.log("err is ",err.response.data.error);
          setSubmitStatus("error");
          setSnackbarMessage(err.response.data.error);
          setSnackbarOpen(true);
          setTimeout(() => {
            setSubmitStatus(null);
          }, 2000);
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token1");
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
    onLogout();
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={submitStatus === "success" ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <div onClick={handleLogout}>
        <LogoutIcon
          sx={{ fontSize: 40 }}
          style={{ color: "red", width: "100%", cursor: "pointer" }}
        />
      </div>
      <div className={"mainContainer"}>
        <div className="viewItems">
          <button className="btn btn-primary">
            <Link to="/admin/dashboard/viewitems" style={{ color: "white" }}>
            Visualizar usuários
            </Link>
          </button>
        </div>
        <div className={"titleContainer"}>
          <div>Cadastrar usuário</div>
        </div>
        <br />
        <div className={"inputContainer"}>
          <input
            value={username}
            placeholder="Nome de usuário"
            onChange={(ev) => setUserName(ev.target.value)}
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
        <div className={"inputContainer"}>
          <input
            value={designation}
            placeholder="Designação"
            onChange={(ev) => setDesignation(ev.target.value)}
            className={"inputBox"}
          />
          <label className="errorLabel">{designationError}</label>
        </div>
        <br />
        <div
          style={{ flexDirection: "row", gap: "20px" }}
          className={"inputContainer"}
        >
          <input
            className="inputButton btn btn-primary px-5 py-2 text-center"
            type="submit"
            onClick={(e) => handleLogin(e)}
            value="Cadastrar usuário"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
