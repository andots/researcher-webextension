import { useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Paper, InputBase, Divider } from '@mui/material';
import { useHistory } from 'react-router-dom';

import { ROUTE_SEARCH } from 'src/constants';
import type { SearchMode } from 'src/types';

type Props = {
  autoFocus?: boolean;
};

SearchBox.defaultProps = {
  autoFocus: false,
};

function SearchBox({ autoFocus }: Props): JSX.Element {
  const history = useHistory<SearchMode>();
  const [keywords, setKeywords] = useState<string>('');

  function requestSubmit(e: React.FormEvent<HTMLDivElement>): void {
    e.preventDefault();
    history.push(ROUTE_SEARCH, { keywords });
  }

  return (
    <Paper
      sx={{
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 36,
        backgroundColor: 'background.default',
        borderRadius: 0,
      }}
      component="form"
      elevation={0}
      onSubmit={(e: any) => requestSubmit(e)}>
      <InputBase
        autoFocus={autoFocus}
        sx={{
          marginLeft: 2,
          flex: 1,
        }}
        id="search-bar-input"
        name="keywords"
        placeholder="Search"
        fullWidth
        onChange={(e) => setKeywords(e.target.value)}
      />
      <Divider sx={{ height: 20 }} orientation="vertical" />
      <IconButton
        aria-label="submit"
        sx={{
          width: 30,
          height: 30,
          marginRight: 1,
          marginLeft: 1,
        }}
        type="submit"
        size="large">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBox;
