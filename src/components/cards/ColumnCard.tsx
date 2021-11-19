import { memo } from 'react';

import {
  BookmarkBorderOutlined,
  HighlightOff,
  PageviewOutlined,
  WatchLaterOutlined,
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
import ThumbnailLink from 'src/components/cards/ThumnailLink';
import { openDeleteDialog } from 'src/redux/slices/deleteDialogSlice';
import { openReadable } from 'src/redux/slices/readableSlice';
import { useAppDispatch } from 'src/redux/store';
import type { BookmarkResponseDoc } from 'src/types';

function ColumnCard({ id, index, bookmarkResponse }: BookmarkResponseDoc): JSX.Element {
  const dispatch = useAppDispatch();
  const { title, excerpt, url, ogImage, bookmarkedAt, isReadLater } = bookmarkResponse;

  const handleDeleteButtonClicked = () => {
    dispatch(openDeleteDialog({ id, index }));
  };

  const handleGoReadable = () => {
    dispatch(openReadable({ id, index, bookmarkResponse }));
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 1,
          paddingLeft: 2,
          paddingRight: 2,
          paddingBottom: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            width: '100%',
            justifyContent: 'flex-start',
          }}>
          <Box
            sx={{
              minHeight: 80,
              maxHeight: 80,
              display: 'flex',
              alignItems: 'center',
            }}>
            <LineClamp lineClamp={2}>
              <Link
                href={url}
                target="_blank"
                rel="noopener"
                variant="h4"
                underline="hover"
                color="textPrimary">
                {title}
              </Link>
            </LineClamp>
            {isReadLater && (
              <FlexBox style={{ marginRight: 4 }}>
                <WatchLaterOutlined color="error" />
              </FlexBox>
            )}
          </Box>
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
          <IconButton size="small" onClick={handleGoReadable}>
            <PageviewOutlined />
          </IconButton>
          <Box mr={1} />
          <IconButton size="small" onClick={handleDeleteButtonClicked}>
            <HighlightOff />
          </IconButton>
        </FlexBox>
      </CardActions>
    </Card>
  );
}

// ! Memorized
export default memo(ColumnCard);
