import type { SearchHit } from '@elastic/elasticsearch/api/types';
import { PushPin } from '@mui/icons-material';
import { Grid } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import TypographyText from 'src/components/atoms/TypographyText';
import SimpleItem from 'src/components/search/SimpleItem';
import type { BookmarkResponse } from 'src/types';

type Props = {
  hits: SearchHit<BookmarkResponse>[];
};

function PinnedReadLater({ hits }: Props): JSX.Element {
  return (
    <FlexBox flexDirection="column" sx={{ mb: 2 }}>
      <FlexBox flexDirection="row" alignItems="center" sx={{ mb: 1 }}>
        <PushPin sx={{ mr: 1 }} />
        <TypographyText text="Pinned Read Later" variant="h2" />
      </FlexBox>

      <Grid
        alignContent="stretch"
        alignItems="stretch"
        direction="row"
        justifyContent="flex-start"
        spacing={2}
        container>
        {hits.map((item) => {
          if (item._source != null) {
            return (
              <Grid key={item._source.url} xs={12} item>
                <SimpleItem searchHit={item} />
              </Grid>
            );
          }
          return;
        })}
      </Grid>
    </FlexBox>
  );
}

export default PinnedReadLater;
