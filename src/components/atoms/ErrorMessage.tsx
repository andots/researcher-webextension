import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useTranslation } from 'react-i18next';

import FlexBox from 'src/components/atoms/FlexBox';
import TypographyText from 'src/components/atoms/TypographyText';

type Props = {
  error: FetchBaseQueryError | SerializedError;
};

function ErrorMessage({ error }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <FlexBox flexDirection="column">
      <TypographyText text={t('error occurred')} variant="h2" />
      <div className="json">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    </FlexBox>
  );
}

export default ErrorMessage;
