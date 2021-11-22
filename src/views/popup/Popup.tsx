import { useState } from 'react';

import { HighlightOff, Star } from '@mui/icons-material';
import type { AlertColor } from '@mui/material';
import {
  Checkbox,
  Rating,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import browser from 'webextension-polyfill';

import 'src/i18n';
import FlexBox from 'src/components/atoms/FlexBox';
import LineClampText from 'src/components/atoms/LineClampText';
import LoadableButton from 'src/components/atoms/LoadableButton';
import PopupAppBar from 'src/components/popup/PopupAppBar';
import PopupEsCheck from 'src/components/popup/PopupEsCheck';
import {
  GET_READABILITY_ARTICLE,
  INDEX_NAME,
  SEARCH_RESULTS_SHOULD_UPDATE,
} from 'src/constants';
import useCustomTheme from 'src/hooks/useCustomTheme';
import { getActiveTab, getAppTab } from 'src/libs/browsers';
import { hasUrlHash, isWebUrl, prepareBookmark, removeUrlHash } from 'src/libs/utils';
import {
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useUpdateBookmarkMutation,
} from 'src/redux/services/elasticsearch/api';
import { getDocByUrl } from 'src/redux/slices/esConfigSlice';
import { useAppDispatch } from 'src/redux/store';
import type { ElasticSearchDoc } from 'src/types';

type Action = 'get' | 'create' | 'update';
type Message =
  | {
      severity: AlertColor;
      title: string;
      text?: string;
    }
  | undefined;

const Popup = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useCustomTheme();
  const dispatch = useAppDispatch();

  // ! state
  const [isBookmakable, setIsBookmarkable] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<browser.Tabs.Tab>();
  const [appTab, setAppTab] = useState<browser.Tabs.Tab | undefined>(undefined);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [esExistDoc, setEsExistDoc] = useState<ElasticSearchDoc>(undefined);
  const [showWarningUrl, setShowWarningUrl] = useState(false);
  const [url, setUrl] = useState<string>();
  const [rating, setRating] = useState<number | null | undefined>(null);
  const [isReadLater, setIsReadLater] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>(undefined);

  // ! mutation
  const [createBookmark, {}] = useCreateBookmarkMutation();
  const [updateBookmark, {}] = useUpdateBookmarkMutation();
  const [deleteBookmark, { isLoading: isDeleteBookmarkLoading }] =
    useDeleteBookmarkMutation();

  // ! Find App Tab
  useEffectOnce(() => {
    const load = async () => {
      const tab = await getAppTab();
      setAppTab(tab);
    };
    load();
  });

  // ! Check isWebUrl when the active tab is a webpage, then get Elasticsearch Doc
  useEffectOnce(() => {
    const load = async () => {
      const tab = await getActiveTab();
      if (tab && tab.url) {
        setActiveTab(tab);
        setUrl(tab.url);
        if (isWebUrl(tab.url)) {
          setShowWarningUrl(hasUrlHash(tab.url));
          await getElasticsearchDoc(tab.url, 'get');
          setIsReady(true);
        } else {
          setIsBookmarkable(false);
        }
      }
    };
    load();
  });

  const getElasticsearchDoc = async (url: string, action: Action) => {
    const esDoc = await dispatch(getDocByUrl({ url })).unwrap();
    setEsExistDoc(esDoc);
    if (esDoc) {
      setRating(esDoc.stars);
      setIsReadLater(esDoc.isReadLater ? esDoc.isReadLater : false);
      if (action === 'get') {
        setMessage({
          severity: 'success',
          title: t('Already Bookmarked'),
          text: new Date(esDoc.bookmarkedAt).toLocaleString('ja'),
        });
      } else if (action === 'create') {
        setMessage({
          severity: 'success',
          title: t('Successfully Bookmarked'),
          text: new Date(esDoc.bookmarkedAt).toLocaleString('ja'),
        });
      } else if (action === 'update') {
        setMessage({
          severity: 'success',
          title: t('Successfully updated'),
          text: new Date(esDoc.bookmarkedAt).toLocaleString('ja'),
        });
      }
    }
  };

  const sendSearchResultShouldUpdate = () => {
    if (appTab && appTab.id) {
      browser.tabs.sendMessage(appTab.id, SEARCH_RESULTS_SHOULD_UPDATE);
    }
  };

  const handleBookmark = async (): Promise<void> => {
    if (activeTab && activeTab.id && activeTab.url) {
      const targetUrl = url ? url : activeTab.url;
      try {
        setIsBookmarking(true);
        // ! get readability article from content_script
        const htmlText: string = await browser.tabs.sendMessage(
          activeTab.id,
          GET_READABILITY_ARTICLE,
        );
        // ! capture tab screenshot image
        // const screenshot = await browser.tabs.captureVisibleTab(undefined, {
        //   format: 'png',
        // });
        const bookmark = prepareBookmark(targetUrl, htmlText);
        bookmark.stars = rating ? rating : 0;
        bookmark.isReadLater = isReadLater;
        if (esExistDoc) {
          await updateBookmark({
            id: esExistDoc.id,
            index: esExistDoc.index,
            body: { doc: bookmark },
          });
          await getElasticsearchDoc(targetUrl, 'update');
          sendSearchResultShouldUpdate();
        } else {
          await createBookmark({
            index: INDEX_NAME,
            body: bookmark,
            refresh: true, // ! must refresh
          });
          await getElasticsearchDoc(targetUrl, 'create');
          sendSearchResultShouldUpdate();
        }
      } catch (e) {
        // ! show error message
        setMessage({
          severity: 'error',
          title: t('error occurred'),
        });
      } finally {
        // ! wait 500ms because usually ES response too fast
        setTimeout(() => setIsBookmarking(false), 500);
      }
    }
  };

  const handleDeleteBookmark = async () => {
    if (esExistDoc) {
      const response = await deleteBookmark({
        id: esExistDoc.id,
        index: esExistDoc.index,
      }).unwrap();
      if (response.result === 'deleted') {
        setEsExistDoc(undefined);
        setMessage({
          severity: 'warning',
          title: t('Successfully deleted'),
        });
        sendSearchResultShouldUpdate();
      }
    }
  };

  const handleRemoveHash = async () => {
    if (activeTab && activeTab.url) {
      setShowWarningUrl(false);
      const newUrl = removeUrlHash(activeTab.url);
      setUrl(newUrl);
      // ! existing check with new url
      await getElasticsearchDoc(newUrl, 'get');
    }
  };

  const ActionButton = () => {
    if (!isReady) {
      return (
        <LoadableButton
          text={t('Bookmark')}
          variant="contained"
          isLoading={false}
          startIcon={<Star htmlColor="#ffffff" />}
          disabled
        />
      );
    }

    if (esExistDoc) {
      return (
        <FlexBox>
          <LoadableButton
            text={t('Delete')}
            variant="contained"
            color="error"
            onClick={handleDeleteBookmark}
            isLoading={isDeleteBookmarkLoading || isBookmarking}
            startIcon={<HighlightOff />}
          />
          <Box mr={2} />
          <LoadableButton
            text={t('Update')}
            variant="contained"
            color="secondary"
            onClick={handleBookmark}
            isLoading={isBookmarking}
            startIcon={<Star />}
          />
        </FlexBox>
      );
    }

    return (
      <LoadableButton
        text={t('Bookmark')}
        variant="contained"
        color="primary"
        onClick={handleBookmark}
        isLoading={isBookmarking}
        startIcon={<Star htmlColor="#ffffff" />}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PopupAppBar />
      <PopupEsCheck>
        <FlexBox flexDirection="column" sx={{ padding: 4 }}>
          {activeTab && activeTab.title && url && (
            <>
              <LineClampText text={activeTab.title} lineClamp={1} variant="h6" />
              <LineClampText text={url} lineClamp={1} variant="caption" />
              {isBookmakable ? (
                <>
                  {message && (
                    <>
                      <Box mt={2} />
                      <Alert severity={message.severity}>
                        <AlertTitle>{message.title}</AlertTitle>
                        {message.text}
                      </Alert>
                    </>
                  )}
                  <Box mt={1} />
                  <FlexBox alignItems="center" justifyContent="space-between">
                    <Rating value={rating} onChange={(_e, value) => setRating(value)} />
                    <FlexBox alignItems="center">
                      <Checkbox
                        checked={isReadLater}
                        onChange={(_e, checked) => setIsReadLater(checked)}
                      />
                      <span>{t('Read Later')}</span>
                    </FlexBox>
                    {/* <span style={{ fontSize: 16 }}>Stars for this article</span> */}
                  </FlexBox>
                  <Box mt={2} />
                  <FlexBox justifyContent="flex-end">
                    <FlexBox flexDirection="column">
                      <ActionButton />
                    </FlexBox>
                  </FlexBox>
                  {showWarningUrl && (
                    <>
                      <Box mt={2} />
                      <Alert
                        severity="warning"
                        icon={false}
                        action={
                          <Button variant="contained" onClick={handleRemoveHash}>
                            Yes
                          </Button>
                        }>
                        {t('URL has hash')}
                      </Alert>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Box mt={2} />
                  <Alert severity="error">{t('Cannot bookmark')}</Alert>
                </>
              )}
            </>
          )}
        </FlexBox>
      </PopupEsCheck>
    </ThemeProvider>
  );
};

export default Popup;
