import { createRef } from 'preact';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import SpacerDivider from 'src/components/atoms/SpacerDivider';
import { setImportResultsFromText } from 'src/redux/slices/importSlice';
import { useAppDispatch } from 'src/redux/store';

type Props = {
  open: boolean;
  onClose: () => void;
};

function TextAreaDialog({ open, onClose }: Props): JSX.Element {
  const { t } = useTranslation();
  const ref = createRef<HTMLTextAreaElement>();
  const dispatch = useAppDispatch();

  const handleOK = () => {
    if (ref.current && ref.current.value !== '') {
      dispatch(setImportResultsFromText(ref.current.value));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="xl">
      <DialogTitle>{t('List of URLs to import')}</DialogTitle>
      <SpacerDivider />
      <DialogContent style={{ minHeight: 500 }}>
        <TextareaAutosize
          ref={ref}
          style={{ width: '100%', height: '90%' }}
          placeholder={t('Enter URLs on each line')}
        />
      </DialogContent>
      <SpacerDivider />
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleOK}>
          {t('OK')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextAreaDialog;
