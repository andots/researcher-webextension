import type { SearchHit } from '@elastic/elasticsearch/api/types';
import { List, ViewColumn, ViewHeadline, ViewList } from '@mui/icons-material';
import { Grid, IconButton, Box } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import ColumnCard from 'src/components/cards/ColumnCard';
import HeadlineCard from 'src/components/cards/HeadlineCard';
import { numberWithCommas } from 'src/libs/utils';
import { setListViewType } from 'src/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import type { ListViewType, BookmarkResponse } from 'src/types';

type Props = {
  hits: SearchHit<BookmarkResponse>[];
  total: number;
};

function SearchResult({ hits, total }: Props): JSX.Element {
  const { listViewType } = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  const handleListViewClick = (type: ListViewType) => {
    dispatch(setListViewType(type));
  };

  return (
    <Box mb={2}>
      <FlexBox alignItems="center" justifyContent="space-between">
        <FlexBox>
          <p>Hits {numberWithCommas(total, 0)} results.</p>
        </FlexBox>
        <FlexBox>
          <IconButton onClick={() => handleListViewClick('headline')} size="large">
            <ViewHeadline />
          </IconButton>
          <IconButton onClick={() => handleListViewClick('imageHeadline')} size="large">
            <ViewList />
          </IconButton>
          <IconButton onClick={() => handleListViewClick('simple')} size="large">
            <List />
          </IconButton>
          <IconButton onClick={() => handleListViewClick('column')} size="large">
            <ViewColumn />
          </IconButton>
        </FlexBox>
      </FlexBox>
      <Grid
        alignContent="stretch"
        alignItems="stretch"
        direction="row"
        justifyContent="flex-start"
        spacing={2}
        container>
        {hits.map((item) => {
          if (item._source) {
            if (listViewType === 'column') {
              return (
                <Grid key={item._source.url} lg={4} md={6} sm={12} xl={4} xs={12} item>
                  <ColumnCard
                    id={item._id}
                    index={item._index}
                    bookmarkResponse={item._source}
                  />
                </Grid>
              );
            } else if (listViewType === 'headline') {
              return (
                <Grid key={item._source.url} xs={12} item>
                  <HeadlineCard searchHit={item} showImage={false} />
                </Grid>
              );
            } else if (listViewType === 'simple') {
              return (
                <Grid key={item._source.url} xs={12} item>
                  <HeadlineCard searchHit={item} showImage={false} simple />
                </Grid>
              );
            } else if (listViewType === 'imageHeadline') {
              return (
                <Grid key={item._source.url} xs={12} item>
                  <HeadlineCard searchHit={item} showImage={true} />
                </Grid>
              );
            }
          }
          return;
        })}
      </Grid>
    </Box>
  );
}

export default SearchResult;
