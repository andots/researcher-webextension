import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import SpacerDivider from 'src/components/atoms/SpacerDivider';
import BrowserBookmarksTreeView from 'src/components/import/BrowserBookmarksTreeView';

type Props = {
  open: boolean;
  onClose: () => void;
};

function TreeViewDialog({ open, onClose }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{t('Check bookmarks you want to import')}</DialogTitle>
      <SpacerDivider />
      <DialogContent style={{ minHeight: 500 }}>
        <BrowserBookmarksTreeView />
      </DialogContent>
      <SpacerDivider />
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TreeViewDialog;
