import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useDeleteBookmarkMutation } from 'src/redux/services/elasticsearch/api';
import { closeDeleteDialog } from 'src/redux/slices/deleteDialogSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

type Props = {
  onOk: (id: string, index: string) => void;
};

function DeleteDialog({ onOk }: Props): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isOpen, id, index } = useAppSelector((s) => s.deleteDialog);
  const [deleteBookmark, {}] = useDeleteBookmarkMutation();

  const handleClose = () => {
    dispatch(closeDeleteDialog());
  };

  const handleOk = async () => {
    if (id && index) {
      const response = await deleteBookmark({ id, index }).unwrap();
      if (response.result === 'deleted') {
        dispatch(closeDeleteDialog());
        onOk(id, index);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{t('Delete Bookmark')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" color="textPrimary">
          {t('Are you sure?')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('Close')}
        </Button>
        <Button onClick={handleOk} color="primary" autoFocus>
          {t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
