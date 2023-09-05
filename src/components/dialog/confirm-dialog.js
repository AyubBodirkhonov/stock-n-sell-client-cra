import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { useState } from 'react';

ConfirmDialog.propTypes = {
  action: PropTypes.any,
  open: PropTypes.any,
  handleClose: PropTypes.any,
  title: PropTypes.any,
  description: PropTypes.any,
};

export function ConfirmDialog(props) {
  // add title and description to props
  const { action, open, handleClose, title, description } = props;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Отменить
          </Button>
          <Button onClick={action} autoFocus>
            Выполнить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
