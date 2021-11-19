import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import FlexBox from 'src/components/atoms/FlexBox';
import AlertBox from 'src/components/popup/AlertBox';
import { validateElasticsearch } from 'src/redux/slices/esConfigSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

type Props = {
  children: React.ReactElement;
};

function PopupEsCheck({ children }: Props): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isReady, isRequiredSetup, isRequiredMigration } = useAppSelector(
    (s) => s.esconfig,
  );

  useEffectOnce(() => {
    dispatch(validateElasticsearch());
  });

  if (isReady) {
    return children;
  }

  if (isRequiredSetup) {
    return (
      <AlertBox
        title={t('Please setup Elasticsearch to start bookmarking.')}
        buttonText={t('Open')}
      />
    );
  }

  if (isRequiredMigration) {
    return (
      <AlertBox title={t('Please upgrade to a newer version.')} buttonText={t('Open')} />
    );
  }

  return (
    <FlexBox sx={{ height: 100 }} justifyContent="center" alignItems="center">
      <CircularProgress color="inherit" />
    </FlexBox>
  );
}

export default PopupEsCheck;
