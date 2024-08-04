import * as React from "react";
import Button from "@mui/material/Button";
import { TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import pantryOperations from "@/pantryCRUD";

export default function FormDialog({ state, handleClose, userId, item, data }) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState("");
  const {editInventory} = pantryOperations(data)
  // console.log(item)
  useEffect(() => {
    setOpen(state);
  }, [state]);
  
  const handleDialogClose = () => {
    setOpen(false);
    handleClose();
  };
  
  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };
  
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson)
            // const email = formJson.email;
            // console.log(email);
            console.log(userId)
            editInventory(userId, formJson, item.id)
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit pantry item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="itemName"
            name="itemName"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            // value = {item.name}
          />
          <TextField
            required
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="unit-label">Units</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              name="unit"
              value={unit}
              onChange={handleUnitChange}
              label="Units"
            >
              <MenuItem value="Piece">
                <em>Piece</em>
              </MenuItem>
              <MenuItem value="Grams">Grams</MenuItem>
              <MenuItem value="KG">KG</MenuItem>
              <MenuItem value="Lb">Lb</MenuItem>
              <MenuItem value="Oz">Oz</MenuItem>
              <MenuItem value="Litre">Litre</MenuItem>
              <MenuItem value="ML">ML</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit">Edit Item</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
