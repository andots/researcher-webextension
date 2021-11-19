import { CircularProgress, Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FlexBox from 'src/components/atoms/FlexBox';
import { useGetHealthCheckQuery } from 'src/redux/services/elasticsearch/api';

const HealthCheck = (): JSX.Element => {
  const { t } = useTranslation();
  const { error, isLoading } = useGetHealthCheckQuery({});

  if (isLoading) {
    return (
      <FlexBox justifyContent="center" alignItems="center" sx={{ height: 80, mt: 2 }}>
        <CircularProgress color="inherit" />
      </FlexBox>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>{t('error occurred')}</AlertTitle>
          {t('general error')}
        </Alert>
      )}
    </>
  );
};

export default HealthCheck;
