import { useState } from 'react';

import { Add, Update } from '@mui/icons-material';
import { Container, Box, Alert, AlertTitle, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'react-use';

import FlexBox from 'src/components/atoms/FlexBox';
import LoadableButton from 'src/components/atoms/LoadableButton';
import TypographyText from 'src/components/atoms/TypographyText';
import { CURRENT_VERSION } from 'src/constants';
import {
  createAliases,
  createConfigIndex,
  createIndices,
  validateElasticsearch,
} from 'src/redux/slices/esConfigSlice';
import { setElasticsearchUrl } from 'src/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

function WelcomePage(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const esUrl = useAppSelector((s) => s.settings.elasticsearchUrl);
  const [url, setUrl] = useState<string>(esUrl);
  const [isLoading, setIsLoading] = useToggle(false);
  const [isUpdatingUrl, setIsUpdatingUrl] = useToggle(false);

  const handleCreate = async () => {
    setIsLoading(true);
    await dispatch(createConfigIndex());
    await dispatch(createIndices({ version: CURRENT_VERSION }));
    await dispatch(createAliases({ version: CURRENT_VERSION }));
    setIsLoading(false);
    dispatch(validateElasticsearch());
  };

  const handleUpdateUrl = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingUrl(true);
    dispatch(setElasticsearchUrl(url));
    setTimeout(() => setIsUpdatingUrl(false), 800);
  };

  return (
    <Container maxWidth="md">
      <FlexBox flexDirection="column">
        <Box mb={3}>
          <TypographyText text={t('Welcome to RE:SEARCHER')} variant="h3" />
          <Box mt={1} />
          <TypographyText
            text={t('RE:SEARCHER is a personal search engine for your bookmarks.')}
            variant="body1"
          />
        </Box>

        <TypographyText text={t('How to Set Up')} variant="h3" sx={{ mb: 2 }} />

        <Box mb={2}>
          <TypographyText text={t('Please see a document')} variant="body1" />
          <p>
            <a
              target="_blank"
              href="https://github.com/andots/researcher-webextension"
              rel="noreferrer">
              https://github.com/andots/researcher-webextension
            </a>
          </p>
        </Box>

        <Box mb={3}>
          <TypographyText text={t('Elasticsearch URL')} variant="h3" sx={{ mb: 1 }} />
          <TypographyText
            text={t(
              'Please update url if you want to change Elasticsearch url and port.',
            )}
            variant="body1"
            sx={{ mb: 2 }}
          />
          <form onSubmit={(e) => handleUpdateUrl(e)}>
            <FlexBox flexDirection="row">
              <TextField
                variant="outlined"
                size="small"
                sx={{ mr: 2, width: 300 }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <LoadableButton
                variant="contained"
                startIcon={<Update />}
                type="submit"
                text={t('Update')}
                isLoading={isUpdatingUrl}
              />
            </FlexBox>
          </form>
        </Box>

        <Box mb={3}>
          <TypographyText text={t('Create Indices')} variant="h3" sx={{ mb: 1 }} />
          <TypographyText
            text={t('Click the button to create indices.')}
            variant="body1"
          />
          <Box mt={2} />
          <FlexBox flexDirection="row" justifyContent="space-between" alignItems="center">
            <LoadableButton
              text={t('Create Indices for RE:SEARCHER')}
              isLoading={isLoading}
              onClick={handleCreate}
              variant="contained"
              startIcon={<Add />}
            />
          </FlexBox>
        </Box>

        <Box mb={2}>
          <Alert severity="warning">
            <AlertTitle>{t('Has been setup?')}</AlertTitle>
            <TypographyText
              text={t('This page can be shown if you do not start Elasticsearch.')}
              variant="body1"
            />
            <TypographyText
              text={t(
                'Please make sure your Elasticsearch is started if you already have done this step.',
              )}
              variant="body1"
            />
          </Alert>
        </Box>
      </FlexBox>
    </Container>
  );
}

export default WelcomePage;
