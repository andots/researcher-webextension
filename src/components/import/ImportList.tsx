import {
  Box,
  Button,
  ListItem,
  Link,
  Alert,
  AlertTitle,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ListChildComponentProps } from 'react-window';
import { FixedSizeList } from 'react-window';
import { serializeError } from 'serialize-error';

import FlexBox from 'src/components/atoms/FlexBox';
import LineClamp from 'src/components/atoms/LineClamp';
import { INDEX_NAME } from 'src/constants';
import { crawl } from 'src/libs/crawl';
import { limit3 } from 'src/libs/plimit';
import { prepareBookmark } from 'src/libs/utils';
import { selectImportResultsReport } from 'src/redux/selectors';
import { useCreateBookmarkMutation } from 'src/redux/services/elasticsearch/api';
import { fetchIsBookmarked } from 'src/redux/slices/esConfigSlice';
import {
  orderImportResults,
  removeImportResult,
  setBackdropOpen,
  updateImportResult,
} from 'src/redux/slices/importSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import type { ImportResult } from 'src/types';

function Row(props: ListChildComponentProps<ImportResult[]>): JSX.Element {
  const { index, style, data: results } = props;
  const result = results[index];
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(removeImportResult(result.url));
  };

  return (
    <ListItem style={style} key={index}>
      <Alert severity={result.status} style={{ width: '100%' }} onClose={handleClose}>
        <AlertTitle>
          <LineClamp lineClamp={1}>
            <Link
              href={result.url}
              target="_blank"
              rel="noopener"
              variant="caption"
              // style={{ textDecoration: 'none' }}
              color="textPrimary">
              {result.url}
            </Link>
          </LineClamp>
        </AlertTitle>
        <LineClamp lineClamp={1}>{result.message}</LineClamp>
      </Alert>
    </ListItem>
  );
}

function ImportList(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const results = useAppSelector((s) => s.import.importResults);
  const { success, error, warning } = useAppSelector(selectImportResultsReport);
  const [createBookmark, {}] = useCreateBookmarkMutation();

  const handleImport = async () => {
    const urls = results.map((a) => a.url);
    const promises = urls.map((url) => {
      return limit3(async () => {
        try {
          // ! existing check at first
          const isBookmarked = await dispatch(fetchIsBookmarked({ url })).unwrap();

          if (isBookmarked) {
            dispatch(
              updateImportResult({
                status: 'warning',
                url,
                message: t('Already Bookmarked'),
              }),
            );
          } else {
            const htmlText = await crawl(url);
            const bookmark = prepareBookmark(url, htmlText);
            const createIndexResponse = await createBookmark({
              index: INDEX_NAME,
              body: bookmark,
            }).unwrap();
            if (createIndexResponse.result === 'created') {
              dispatch(
                updateImportResult({
                  status: 'success',
                  url,
                  message: t('Successfully bookmarked'),
                }),
              );
            } else {
              throw Error(t('Failed to create index'));
            }
          }
        } catch (e) {
          const error = serializeError(e);
          dispatch(
            updateImportResult({
              status: 'error',
              url,
              message: error.message ? error.message : 'Something went wrong',
            }),
          );
        }
      });
    });
    dispatch(setBackdropOpen(true));
    await Promise.all(promises);
    dispatch(orderImportResults());
    dispatch(setBackdropOpen(false));
  };

  if (results.length === 0) {
    return <></>;
  }

  return (
    <FlexBox flexDirection="column">
      <Typography>{`${success} of ${results.length} successfully imported.`}</Typography>
      <Typography>{`${error} of ${results.length} error occured.`}</Typography>
      <Typography>{`${warning} of ${results.length} got warning.`}</Typography>
      <Box sx={{ width: '100%', mt: 2 }}>
        <FixedSizeList
          height={580} // list height
          width="100%"
          itemSize={74} // listitem height
          itemData={results}
          itemCount={results.length}
          overscanCount={5}>
          {Row}
        </FixedSizeList>
      </Box>
      <Box mt={3} />
      <Button
        onClick={handleImport}
        variant="contained"
        color="primary"
        disabled={results.length === 0}>
        {t('Start fetching')}
      </Button>
    </FlexBox>
  );
}

export default ImportList;
