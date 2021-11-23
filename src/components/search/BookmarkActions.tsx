import {
  BookmarkBorderOutlined,
  PageviewOutlined,
  HighlightOff,
} from '@mui/icons-material';
import { Link, Box, Button, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FlexBox from 'src/components/atoms/FlexBox';
import TypographyText from 'src/components/atoms/TypographyText';
import MyRating from 'src/components/controls/MyRating';
import Favicon from 'src/components/search/Favicon';
import { openDeleteDialog } from 'src/redux/slices/deleteDialogSlice';
import { openReadable } from 'src/redux/slices/readableSlice';
import { useAppDispatch } from 'src/redux/store';
import type { BookmarkResponseDoc } from 'src/types';

function BookmarkActions({
  id,
  index,
  bookmarkResponse,
}: BookmarkResponseDoc): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isDownLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const { site, bookmarkedAt, stars } = bookmarkResponse;

  const handleDeleteButtonClicked = () => {
    dispatch(openDeleteDialog({ id, index }));
  };

  const handleGoReadable = () => {
    dispatch(openReadable({ id, index, bookmarkResponse }));
  };

  return (
    <FlexBox justifyContent="space-between" alignContent="center" alignItems="center">
      <FlexBox alignContent="center" alignItems="center">
        <MyRating id={id} index={index} stars={stars || 0} />
        <Box mr={1} />

        {!isDownMd && (
          <FlexBox alignItems="center">
            <BookmarkBorderOutlined />
            <Box mr={0.5} />
            <TypographyText
              text={new Date(bookmarkedAt).toLocaleString('ja')}
              variant="body2"
            />
            <Box mr={2} />

            <Favicon site={site} size={18} />
            <Box mr={1} />
            <div>
              <Link
                href={`https://${site}`}
                target="_blank"
                rel="noopener"
                underline="hover"
                variant="body2"
                color="textPrimary">
                {site}
              </Link>
            </div>
          </FlexBox>
        )}
      </FlexBox>

      {isDownLg ? (
        <FlexBox>
          <IconButton onClick={handleGoReadable}>
            <PageviewOutlined />
          </IconButton>
          <IconButton onClick={handleDeleteButtonClicked}>
            <HighlightOff />
          </IconButton>
        </FlexBox>
      ) : (
        <FlexBox>
          <Button
            size="small"
            color="inherit"
            startIcon={<PageviewOutlined />}
            onClick={handleGoReadable}>
            {t('Quick View')}
          </Button>
          <Box mr={1} />
          <Button
            size="small"
            color="inherit"
            startIcon={<HighlightOff />}
            onClick={handleDeleteButtonClicked}>
            {t('Delete')}
          </Button>
        </FlexBox>
      )}
    </FlexBox>
  );
}

export default BookmarkActions;
