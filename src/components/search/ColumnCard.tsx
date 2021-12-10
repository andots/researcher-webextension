import { memo } from 'react';

import {
  ArticleOutlined,
  BookmarkBorderOutlined,
  CancelOutlined,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Link,
} from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import LineClamp from 'src/components/atoms/LineClamp';
import LineClampText from 'src/components/atoms/LineClampText';
import ThumbnailLink from 'src/components/search/ThumnailLink';
import { useUpdateBookmarkMutation } from 'src/redux/services/elasticsearch/api';
import { openDeleteDialog } from 'src/redux/slices/deleteDialogSlice';
import { openReadable } from 'src/redux/slices/readableSlice';
import { updateSearchHit } from 'src/redux/slices/searchSlice';
import { useAppDispatch } from 'src/redux/store';
import type { BookmarkResponseDoc } from 'src/types';

function ColumnCard({ id, index, bookmarkResponse }: BookmarkResponseDoc): JSX.Element {
  const dispatch = useAppDispatch();
  const [updateBookmark, {}] = useUpdateBookmarkMutation();
  const { title, excerpt, url, ogImage, bookmarkedAt, isReadLater } = bookmarkResponse;

  const handleDeleteButtonClicked = () => {
    dispatch(openDeleteDialog({ id, index }));
  };

  const handleGoReadable = () => {
    dispatch(openReadable({ id, index, bookmarkResponse }));
  };

  const handleToggleReadLater = () => {
    updateBookmark({
      id,
      index,
      body: { doc: { isReadLater: !isReadLater } },
    });
    dispatch(updateSearchHit({ id, index, patch: { isReadLater: !isReadLater } }));
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 2,
          paddingRight: 1,
        }}>
        <Box
          sx={{
            minHeight: 80,
            maxHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <LineClamp lineClamp={2}>
            <Link
              href={url}
              target="_blank"
              rel="noopener"
              variant="h5"
              underline="hover"
              color="textPrimary">
              {title}
            </Link>
          </LineClamp>
        </Box>
      </Box>

      <CardMedia>
        <ThumbnailLink url={url} imageUrl={ogImage} width="100%" height={180} />
      </CardMedia>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          minHeight: 70,
          maxHeight: 70,
        }}>
        <LineClampText color="textPrimary" lineClamp={2} text={excerpt} variant="body2" />
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'space-between',
          paddingLeft: 1,
          paddingRight: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <BookmarkBorderOutlined />
          <Box mr={1} />
          <LineClampText
            color="textPrimary"
            lineClamp={1}
            text={new Date(bookmarkedAt).toLocaleString('ja')}
            variant="body2"
          />
        </Box>

        <FlexBox flexDirection="row">
          <IconButton size="small" onClick={handleToggleReadLater}>
            {isReadLater ? <PushPin /> : <PushPinOutlined />}
          </IconButton>
          <IconButton size="small" onClick={handleGoReadable}>
            <ArticleOutlined />
          </IconButton>
          <IconButton size="small" onClick={handleDeleteButtonClicked}>
            <CancelOutlined />
          </IconButton>
        </FlexBox>
      </CardActions>
    </Card>
  );
}

// ! Memorized
export default memo(ColumnCard);
