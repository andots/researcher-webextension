import type React from 'react';
import { useState, useRef } from 'react';

import { ExpandMore, Translate } from '@mui/icons-material';
import { Button, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TypographyText from 'src/components/atoms/TypographyText';

export default function LanguageSwitcher(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const { i18n } = useTranslation();

  const currentLanguage = (): string => {
    const current = i18n.language;

    if (current.includes('ja')) {
      return '日本語';
    }

    if (current.includes('en')) {
      return 'English';
    }

    return '';
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <div ref={divRef}>
      <Button
        color="inherit"
        aria-haspopup="true"
        aria-label="Change language"
        onClick={handleClick}>
        <Translate style={{ marginRight: 4 }} />
        {!isDownMD && <TypographyText text={currentLanguage()} />}
        <ExpandMore fontSize="small" />
      </Button>
      <Menu
        anchorEl={anchorEl}
        container={divRef.current}
        id="simple-menu"
        open={Boolean(anchorEl)}
        // keepMounted // ! this caused error on preact
        onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage('ja')}>日本語</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
      </Menu>
    </div>
  );
}
