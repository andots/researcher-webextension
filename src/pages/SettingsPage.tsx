import { useState } from 'react';

import { Update } from '@mui/icons-material';
import { Container, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'react-use';

import FlexBox from 'src/components/atoms/FlexBox';
import LoadableButton from 'src/components/atoms/LoadableButton';
import SpacerDivider from 'src/components/atoms/SpacerDivider';
import TypographyText from 'src/components/atoms/TypographyText';
import ExportButton from 'src/components/controls/ExportButton';
import { setElasticsearchUrl } from 'src/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

function SettingsPage(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const esUrl = useAppSelector((s) => s.settings.elasticsearchUrl);
  const [url, setUrl] = useState<string>(esUrl);
  const [isUpdatingUrl, setIsUpdatingUrl] = useToggle(false);

  const handleUpdateUrl = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingUrl(true);
    dispatch(setElasticsearchUrl(url));
    setTimeout(() => setIsUpdatingUrl(false), 800);
  };

  return (
    <Container>
      <FlexBox flexDirection="column">
        <FlexBox flexDirection="column">
          <TypographyText text={t('Export')} variant="h2" sx={{ mb: 2 }} />
          <FlexBox flexDirection="column">
            <TypographyText
              text={t('Export bookmarks to HTML.')}
              variant="body1"
              sx={{ mb: 2 }}
            />
            <div>
              <ExportButton />
            </div>
          </FlexBox>
        </FlexBox>
        <SpacerDivider spacing={2} />

        <TypographyText text="Elasticsearch" variant="h2" sx={{ mb: 2 }} />
        <FlexBox flexDirection="column">
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
        </FlexBox>
        <SpacerDivider spacing={2} />
      </FlexBox>
    </Container>
  );
}

export default SettingsPage;
