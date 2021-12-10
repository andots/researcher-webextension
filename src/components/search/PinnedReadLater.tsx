import type { SearchHit } from '@elastic/elasticsearch/api/types';
import { Close, PushPin } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import TypographyText from 'src/components/atoms/TypographyText';
import SimpleItem from 'src/components/search/SimpleItem';
import type { BookmarkResponse } from 'src/types';

type Props = {
  hits: SearchHit<BookmarkResponse>[];
};

function PinnedReadLater({ hits }: Props): JSX.Element {
  if (hits.length == 0) {
    return <></>;
  }

  return (
    <FlexBox flexDirection="column" sx={{ mb: 3 }}>
      <FlexBox flexDirection="row" alignItems="center" sx={{ mb: 2 }}>
        <PushPin sx={{ mr: 1 }} />
        <TypographyText text="Pinned Read Later" variant="h2" />
      </FlexBox>

      {hits.map((item) => {
        if (item._source != null) {
          return (
            <FlexBox sx={{ position: 'relative', left: '-6px' }}>
              <IconButton size="small" sx={{ marginRight: 1 }}>
                <Close />
              </IconButton>
              <SimpleItem searchHit={item} />
            </FlexBox>
          );
        }
        return;
      })}
    </FlexBox>
  );
}

export default PinnedReadLater;
