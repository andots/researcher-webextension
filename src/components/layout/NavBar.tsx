import { ArrowBack, ArrowForward, Search } from '@mui/icons-material';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { useHistory } from 'react-router-dom';
import useToggle from 'react-use/lib/useToggle';

import FlexBox from 'src/components/atoms/FlexBox';
import LanguageSwitcher from 'src/components/controls/LanguageSwitcher';
import SearchBox from 'src/components/controls/SearchBox';
import ThemeChangeIconButton from 'src/components/controls/ThemeChangeIconButton';
import BrandMenuLogo from 'src/components/layout/BrandMenuLogo';
import { NAVBAR_HEIGHT } from 'src/constants';

type Props = {
  onMenuIconClick: () => void;
};

function NavBar({ onMenuIconClick }: Props): JSX.Element {
  const theme = useTheme();
  const isDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [isSearchFieldOpen, toggleSearchField] = useToggle(false);
  const history = useHistory();

  if (isSearchFieldOpen && isDownSM) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          height: NAVBAR_HEIGHT,
          position: 'fixed',
          top: '0px',
          width: '100%',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Box
          sx={{
            paddingLeft: 4,
            paddingRight: 6,
            display: 'flex',
            width: '100%',
            alignItems: 'center',
          }}>
          <IconButton onClick={toggleSearchField} size="large">
            <ArrowBack />
          </IconButton>
          <Box flexGrow={1} ml={2}>
            <SearchBox autoFocus />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        height: NAVBAR_HEIGHT,
        position: 'fixed',
        top: '0px',
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <FlexBox
        sx={{
          paddingLeft: '14px',
        }}>
        <BrandMenuLogo onMenuIconClick={onMenuIconClick} />
      </FlexBox>

      <Box
        sx={{
          flexGrow: 1,
          maxWidth: 800,
          paddingLeft: 4,
          paddingRight: 2,
          display: ['none', 'none', 'flex'],
        }}>
        <SearchBox />
      </Box>

      <FlexBox sx={{ paddingRight: 1, paddingLeft: 1 }} alignItems="center">
        <FlexBox justifyContent="flex-end" alignItems="center">
          <Box sx={{ marginRight: '1px' }}>
            <Box sx={{ display: ['inline', 'inline', 'none'] }}>
              <IconButton onClick={() => toggleSearchField()} size="large">
                <Search />
              </IconButton>
            </Box>
          </Box>

          <FlexBox sx={{ mr: '1px' }}>
            <IconButton>
              <ArrowBack onClick={() => history.goBack()} />
            </IconButton>

            <IconButton>
              <ArrowForward onClick={() => history.goForward()} />
            </IconButton>
          </FlexBox>

          <Box sx={{ mr: '1px' }}>
            <ThemeChangeIconButton />
          </Box>

          <Box sx={{ mr: '1px' }}>
            <LanguageSwitcher />
          </Box>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}

export default NavBar;
