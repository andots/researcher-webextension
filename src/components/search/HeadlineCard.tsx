import { memo } from 'react';

import type { SearchHit } from '@elastic/elasticsearch/api/types';
import { PushPin } from '@mui/icons-material';
import { Box, Link } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import LineClamp from 'src/components/atoms/LineClamp';
import BookmarkActions from 'src/components/search/BookmarkActions';
import Description from 'src/components/search/Description';
import ThumbnailLink from 'src/components/search/ThumnailLink';
import { getDecodedShortURL } from 'src/libs/utils';
import type { BookmarkResponse } from 'src/types';

type Props = {
  searchHit: SearchHit<BookmarkResponse>;
  showImage?: boolean;
  simple?: boolean;
};

function HeadlineCard({ searchHit, showImage, simple }: Props): JSX.Element {
  const { _id: id, _index: index, _source: source, highlight } = searchHit;

  if (source == null) {
    return <></>;
  }

  const { url, title, ogImage, isReadLater } = source;

  return (
    <FlexBox flexDirection="column" sx={{ mb: 1 }}>
      <FlexBox flexDirection="row">
        {showImage && (
          <Box sx={{ mr: 2, mt: 2, mb: 2 }}>
            <ThumbnailLink url={url} imageUrl={ogImage} width={200} height={110} />
          </Box>
        )}

        <FlexBox flexDirection="column" sx={{ mb: 0.5 }}>
          {!simple && (
            <LineClamp lineClamp={1}>
              <Link
                href={url}
                target="_blank"
                rel="noopener"
                variant="caption"
                color="textPrimary">
                {getDecodedShortURL(url, 100)}
              </Link>
            </LineClamp>
          )}

          <FlexBox alignItems="center">
            <LineClamp lineClamp={1}>
              <Link
                href={url}
                target="_blank"
                rel="noopener"
                variant="h2"
                underline="hover"
                color="textSecondary">
                {title}
              </Link>
            </LineClamp>
            {isReadLater && <PushPin sx={{ ml: 1 }} />}
          </FlexBox>

          {!simple && <Description highlight={highlight} />}
        </FlexBox>
      </FlexBox>

      <BookmarkActions id={id} index={index} bookmarkResponse={source} />
    </FlexBox>
  );
}

// ! Memorized
export default memo(HeadlineCard);

// custom comparison
// export default memo(HeadlineCard, (prev, next) => {
//   // ! Only re-render when _id changes
//   return prev.searchHit._id === next.searchHit._id;
// });
