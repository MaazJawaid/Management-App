import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ViewItems = () => {
  const [getRegisteredUser, setGetRegisteredUser] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [deleteOccurence, setDeleteOccurence] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/admin/dashboard/viewitems/getRegisteredUser")
      .then((res) => {
        setGetRegisteredUser(res.data);
      });
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(user.password);
    setDesignation(user.designation);
    setEditMode(true);
  };

  const handleSave = () => {
    axios.put(`http://localhost:3000/updateOccurence/${selectedUser._id}`, { username, password, designation })
      .then((res) => {
        console.log(res);
        // Update the state to reflect the changes
        const updatedUsers = getRegisteredUser.map(user => {
          if (user._id === selectedUser._id) {
            return { ...user, username, password, designation };
          }
          return user;
        });
        setGetRegisteredUser(updatedUsers);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });

    setEditMode(false);
  };

  const handleDelete = (user) => {
    if (!editMode) {
      setSelectedUser(user);
      setOpenDeleteConfirmation(true);
    }
  };

  const handleConfirmDelete = () => {
    // Implement delete logic here
    axios.delete(`http://localhost:3000/deleteoccurrence/${selectedUser._id}`)
      .then((res) => {
        console.log("user deleted", res);
        // Update the state to remove the deleted user
        const updatedUsers = getRegisteredUser.filter(user => user._id !== selectedUser._id);
        setGetRegisteredUser(updatedUsers);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });

    setOpenDeleteConfirmation(false);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };

  return (
    <div id="viewpage" className="container">
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Nome de usuário</th>
              <th>Senha</th>
              <th>Designação</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {getRegisteredUser.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {editMode && selectedUser === user ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                      }}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editMode && selectedUser === user ? (
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                    />
                  ) : (
                    user.password
                  )}
                </td>
                <td>
                  {editMode && selectedUser === user ? (
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => {
                        setDesignation(e.target.value)
                      }}
                    />
                  ) : (
                    user.designation
                  )}
                </td>
                <td>
                  {editMode && selectedUser === user ? (
                    <Button onClick={handleSave} variant="contained" color="primary">Salvar</Button>
                  ) : (
                    <Button onClick={() => handleEdit(user)} variant="contained" color="primary">Editar</Button>
                  )}
                </td>
                <td>
                  <Button onClick={() => handleDelete(user)} variant="contained" color="secondary" disabled={editMode}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={openDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewItems;
