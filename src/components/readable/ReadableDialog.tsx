import { lazy, Suspense } from 'react';

import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import SpacerDivider from 'src/components/atoms/SpacerDivider';
import { closeReadable } from 'src/redux/slices/readableSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

const ReadableArticle = lazy(() => import('src/components/readable/ReadableArticle'));

function ReadableDialog(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { open, id, index, bookmarkResponse } = useAppSelector((s) => s.readable);
  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    dispatch(closeReadable());
  };

  if (id == null || index == null || bookmarkResponse == null) {
    return <></>;
  }

  return (
    <Dialog
      open={open}
      fullScreen={fullscreen}
      onClose={handleClose}
      scroll="paper"
      maxWidth="md"
      PaperProps={{
        elevation: 0,
        sx: {
          backgroundColor: 'background.default',
        },
      }}
      fullWidth>
      <DialogContent sx={{ paddingX: 12 }}>
        <Box maxWidth="md">
          <Suspense fallback={null}>
            <ReadableArticle id={id} index={index} bookmarkResponse={bookmarkResponse} />
          </Suspense>
        </Box>
      </DialogContent>
      <SpacerDivider spacing={0} />
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReadableDialog;
