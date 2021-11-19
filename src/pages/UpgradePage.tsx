import { Upgrade } from '@mui/icons-material';
import { Alert, Backdrop, CircularProgress, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FlexBox from 'src/components/atoms/FlexBox';
import LoadableButton from 'src/components/atoms/LoadableButton';
import TypographyText from 'src/components/atoms/TypographyText';
import ExportButton from 'src/components/controls/ExportButton';
import { migrateV1ToV2, reindex, reindexV3ToV4 } from 'src/redux/slices/esConfigSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

function UpgradePage(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { mappingVersion, isUpgrading } = useAppSelector((s) => s.esconfig);

  const handleUpgrade = () => {
    if (mappingVersion === 'v0') {
      dispatch(reindex());
    } else if (mappingVersion === 'v1') {
      dispatch(migrateV1ToV2());
    } else if (mappingVersion === 'v2') {
      dispatch(reindex());
    } else if (mappingVersion === 'v3') {
      dispatch(reindexV3ToV4());
    }
  };

  return (
    <Container>
      <Backdrop open={isUpgrading} className="backdrop">
        <CircularProgress color="inherit" />
      </Backdrop>

      <FlexBox flexDirection="column">
        <FlexBox flexDirection="column" sx={{ mb: 3 }}>
          <TypographyText text={t('Backup')} variant="h3" sx={{ mb: 2 }} />
          <FlexBox flexDirection="column">
            <TypographyText
              text={t('Backup bookmarks to HTML.')}
              variant="body1"
              sx={{ mb: 2 }}
            />
            <div>
              <ExportButton />
            </div>
          </FlexBox>
        </FlexBox>

        <TypographyText text={t('Upgrade')} variant="h3" sx={{ mb: 2 }} />
        <Alert severity="error">
          <FlexBox flexDirection="column">
            {t('Click the button bellow to execute upgrading script.')}
          </FlexBox>
        </Alert>
        <FlexBox justifyContent="center">
          <LoadableButton
            sx={{ mt: 2 }}
            text={t('Upgrade to new version')}
            onClick={handleUpgrade}
            variant="contained"
            startIcon={<Upgrade />}
          />
        </FlexBox>
      </FlexBox>
    </Container>
  );
}

export default UpgradePage;
