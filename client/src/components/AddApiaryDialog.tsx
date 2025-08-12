import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function AddApiaryDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget); //recupere tout le formulaire
    const formJson = Object.fromEntries(formData.entries()); // convertis le formulaire en objet
    const name = formJson.name;
    const address = formJson.address;
    const city = formJson.city;

    const apiaryData = {
      name: name,
      address: address,
      city: city,
    };

    try {
      const response = await axios.post("http://localhost:3000/api/apiaries", apiaryData);
      console.log("Rucher crée avec succes", response.data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Créer un nouveau rucher</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ajoutez un rucher à votre exploitation apicole.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="apiary-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Nom du rucher"
              type="text"
              fullWidth
              variant="standard"
              placeholder="ex: Rucher des Tilleuls"
            />
            <TextField
              required
              margin="dense"
              id="address"
              name="address"
              label="Adresse"
              type="text"
              fullWidth
              variant="standard"
              placeholder="ex: Chemin des Abeilles 15"
            />
            <TextField
              required
              margin="dense"
              id="city"
              name="city"
              label="Ville"
              type="text"
              fullWidth
              variant="standard"
              placeholder="ex: Namur"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit" form="apiary-form">
            Créer le rucher
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default AddApiaryDialog;
