import { CircularProgress } from '@mui/material';
import { useEffectOnce } from 'react-use';

import FlexBox from 'src/components/atoms/FlexBox';
import UpgradePage from 'src/pages/UpgradePage';
import WelcomePage from 'src/pages/WelcomePage';
import { validateElasticsearch } from 'src/redux/slices/esConfigSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

type Props = {
  children: React.ReactElement;
};

function EsCheck({ children }: Props): JSX.Element {
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
    return <WelcomePage />;
  }

  if (isRequiredMigration) {
    return <UpgradePage />;
  }

  return (
    <FlexBox sx={{ height: 300 }} justifyContent="center" alignItems="center">
      <CircularProgress color="inherit" />
    </FlexBox>
  );
}

export default EsCheck;
