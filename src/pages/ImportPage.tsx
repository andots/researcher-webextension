import { useState } from 'react';

import { FeaturedPlayListOutlined, PlaylistAdd } from '@mui/icons-material';
import { Backdrop, Button, CircularProgress, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FlexBox from 'src/components/atoms/FlexBox';
import SpacerDivider from 'src/components/atoms/SpacerDivider';
import TypographyText from 'src/components/atoms/TypographyText';
import ImportFromHtmlButton from 'src/components/controls/ImportFromHtmlButton';
import ImportList from 'src/components/import/ImportList';
import TextAreaDialog from 'src/components/import/TextAreaDialog';
import TreeViewDialog from 'src/components/import/TreeViewDialog';
import { useAppSelector } from 'src/redux/store';

function ImportPage(): JSX.Element {
  const { t } = useTranslation();
  const [treeviewDialogOpen, setTreeviewDialogOpen] = useState(false);
  const [textareaDialogOpen, setTextareaDialogOpen] = useState(false);
  const backdropOpen = useAppSelector((s) => s.import.backdropOpen);

  return (
    <Container>
      <Backdrop open={backdropOpen} className="backdrop">
        <CircularProgress color="inherit" />
      </Backdrop>

      <TextAreaDialog
        open={textareaDialogOpen}
        onClose={() => setTextareaDialogOpen(false)}
      />

      <TreeViewDialog
        open={treeviewDialogOpen}
        onClose={() => setTreeviewDialogOpen(false)}
      />

      <FlexBox flexDirection="column">
        <TypographyText text={t('Import bookmarks')} variant="h2" />

        <SpacerDivider spacing={2} />

        <FlexBox flexDirection="row" alignItems="center" justifyContent="space-between">
          <TypographyText text={t('Choose bookmarks from browser')} variant="h5" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<FeaturedPlayListOutlined />}
            onClick={() => setTreeviewDialogOpen(true)}>
            {t('Import')}
          </Button>
        </FlexBox>

        <SpacerDivider spacing={2} />
        <FlexBox flexDirection="row" alignItems="center" justifyContent="space-between">
          <TypographyText text={t('Import from HTML')} variant="h5" />
          <ImportFromHtmlButton />
        </FlexBox>

        <SpacerDivider spacing={2} />
        <FlexBox flexDirection="row" alignItems="center" justifyContent="space-between">
          <TypographyText text={t('From Textarea')} variant="h5" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlaylistAdd />}
            onClick={() => setTextareaDialogOpen(true)}>
            {t('Import')}
          </Button>
        </FlexBox>

        <SpacerDivider spacing={2} />

        <ImportList />
      </FlexBox>
    </Container>
  );
}

export default ImportPage;
