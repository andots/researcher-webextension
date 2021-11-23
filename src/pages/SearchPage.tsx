import { createRef } from 'preact';

import { useEffect, useCallback, useMemo } from 'react';

import { Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import browser from 'webextension-polyfill';

import ErrorMessage from 'src/components/atoms/ErrorMessage';
import TypographyText from 'src/components/atoms/TypographyText';
import DeleteDialog from 'src/components/dialogs/DeleteDialog';
import ReadableDialog from 'src/components/readable/ReadableDialog';
import PinnedReadLater from 'src/components/search/PinnedReadLater';
import SearchResult from 'src/components/search/SearchResult';
import { SEARCH_RESULTS_SHOULD_UPDATE } from 'src/constants';
import { useInfiniteLoad } from 'src/hooks/useInfiniteLoad';
import { scrollToTop } from 'src/libs/utils';
import { useSearchQuery } from 'src/redux/services/elasticsearch/api';
import { getReadLaterQueryBody } from 'src/redux/services/elasticsearch/config/queries';
import {
  getSearchHits,
  removeSearchHit,
  resetSearchCache,
  resetSearchHits,
} from 'src/redux/slices/searchSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import type { SearchMode } from 'src/types';

function SearchPage(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation<SearchMode>();
  const searchMode: SearchMode = useMemo(
    () => (location.state ? location.state : { keywords: '' }),
    [location],
  );
  const { searchHits, totalHits, isInitialized, hasMore, isLoading, error } =
    useAppSelector((s) => s.search);
  const loader = createRef<HTMLDivElement>();

  // Pinned read later
  const { data: readLaterHits } = useSearchQuery({ body: getReadLaterQueryBody() });

  // ! Scroll to top when state (SearchMode) changes
  useEffect(() => {
    scrollToTop();
  }, [searchMode]);

  // ! Initial fetch
  useEffect(() => {
    dispatch(resetSearchHits());
    dispatch(getSearchHits(searchMode));
  }, [dispatch, searchMode]);

  // ! Listening update message from popup
  useEffect(() => {
    browser.runtime.onMessage.addListener((message: string) => {
      if (message === SEARCH_RESULTS_SHOULD_UPDATE) {
        dispatch(resetSearchCache());
        dispatch(resetSearchHits());
        dispatch(getSearchHits({ keywords: '' }));
      }
    });
  }, [dispatch]);

  const loadMore = useCallback(
    async (entries) => {
      const target = entries[0];

      if (target.isIntersecting && hasMore) {
        dispatch(getSearchHits(searchMode));
      }
    },
    [dispatch, hasMore, searchMode],
  );
  useInfiniteLoad(loader, loadMore);

  const handleAfterDelete = (id: string, index: string) => {
    dispatch(removeSearchHit({ id, index }));
  };

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <Container>
      <DeleteDialog onOk={(id, index) => handleAfterDelete(id, index)} />
      <ReadableDialog />
      {readLaterHits && <PinnedReadLater hits={readLaterHits.hits.hits} />}
      {isInitialized && searchHits.length > 0 && (
        <Box>
          <SearchResult hits={searchHits} total={totalHits} />
          <Box mt={1} />
          <div
            ref={loader}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 30,
              width: '100%',
            }}>
            {isLoading && <p>{t('- Loading -')}</p>}
            {!hasMore && <p>{t('- End -')}</p>}
          </div>
        </Box>
      )}
      {isInitialized && searchHits.length === 0 && (
        <TypographyText variant="body1" text={t('Nothing found.')} />
      )}
    </Container>
  );
}

export default SearchPage;
