import { memo } from 'react';

import type { SearchHit } from '@elastic/elasticsearch/api/types';
import { Box, Link } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import LineClamp from 'src/components/atoms/LineClamp';
import Favicon from 'src/components/search/Favicon';
import type { BookmarkResponse } from 'src/types';

type Props = {
  searchHit: SearchHit<BookmarkResponse>;
};

function SimpleItem({ searchHit }: Props): JSX.Element {
  const { _source: source } = searchHit;

  if (source == null) {
    return <></>;
  }

  const { url, title, site } = source;

  return (
    <FlexBox flexDirection="row" alignItems="center" sx={{ paddingLeft: '2px' }}>
      <Favicon site={site} size={18} />
      <Box mr={1.5} />
      <LineClamp lineClamp={1}>
        <Link
          href={url}
          target="_blank"
          rel="noopener"
          variant="body1"
          underline="hover"
          color="textSecondary">
          {title}
        </Link>
      </LineClamp>
    </FlexBox>
  );
}

// ! Memorized
export default memo(SimpleItem);
