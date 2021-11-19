import { ListItem, ListItemIcon } from '@mui/material';

import TypographyText from 'src/components/atoms/TypographyText';

type Props = {
  headerText: string;
  icon: JSX.Element;
  onClick: () => void;
};

function IconList({ headerText, icon, onClick }: Props): JSX.Element {
  function handleClick() {
    onClick();
  }

  return (
    <ListItem
      sx={{
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
      }}
      button
      onClick={handleClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <TypographyText text={headerText} variant="overline" />
    </ListItem>
  );
}

export default IconList;
