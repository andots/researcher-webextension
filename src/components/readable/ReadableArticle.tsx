/* eslint-disable react/no-danger */
import 'highlight.js/styles/atom-one-dark.css';

import { createRef } from 'preact';

import { useEffect, useState } from 'react';

import { Checkbox, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FlexBox from 'src/components/atoms/FlexBox';
import SpacerDivider from 'src/components/atoms/SpacerDivider';
import MyRating from 'src/components/controls/MyRating';
import EmbedPlayer from 'src/components/readable/EmbedPlayer';
import HighlightJs from 'src/libs/highlightjs';
import { getEmbeddable, getDecodedShortURL } from 'src/libs/utils';
import {
  useGetBookmarkQuery,
  useUpdateBookmarkMutation,
} from 'src/redux/services/elasticsearch/api';
import { updateSearchHit } from 'src/redux/slices/searchSlice';
import { useAppDispatch } from 'src/redux/store';
import type { BookmarkResponse, EmbeddableType } from 'src/types';

type Props = {
  id: string;
  index: string;
  bookmarkResponse: BookmarkResponse;
};

function ReadableArticle({ id, index, bookmarkResponse }: Props): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const ref = createRef<HTMLDivElement>();
  const [embeddable, setEmbeddable] = useState<EmbeddableType>({ isEmbeddable: false });
  const [updateBookmark, {}] = useUpdateBookmarkMutation();

  const { url, title, isReadLater, stars } = bookmarkResponse;
  const [currentIsReadLater, setIsReadLater] = useState<boolean>(isReadLater);
  // ! call Elasticsearch to get bookmark's html
  const { data } = useGetBookmarkQuery({ id, index, _source_includes: ['html'] });

  useEffect(() => {
    const d = getEmbeddable(url);
    setEmbeddable(d);
  }, [url]);

  useEffect(() => {
    if (data && ref.current) {
      const preCodeNodes = ref.current.querySelectorAll<HTMLElement>('pre code');
      preCodeNodes.forEach((el) => {
        if (
          el.hasChildNodes() &&
          el.childNodes.length === 1 &&
          el.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          HighlightJs.highlightElement(el);
        }
      });
      const preNodes = ref.current.querySelectorAll<HTMLElement>('pre');
      preNodes.forEach((el) => {
        if (
          el.hasChildNodes() &&
          el.childNodes.length === 1 &&
          el.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          HighlightJs.highlightElement(el);
        }
      });
    }
  }, [data, ref]);

  const handleIsReadLater = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    updateBookmark({
      id,
      index,
      body: { doc: { isReadLater: checked, bookmarkedAt: new Date().toISOString() } },
    });
    setIsReadLater(checked);
    dispatch(updateSearchHit({ id, index, patch: { isReadLater: checked } }));
  };

  return (
    <div className="readable">
      <FlexBox flexDirection="column">
        <div>
          <Link
            href={url}
            target="_blank"
            rel="noopener"
            variant="caption"
            underline="always"
            color="textSecondary">
            {getDecodedShortURL(url, 100)}
          </Link>
        </div>

        <h1>{title}</h1>

        <FlexBox alignItems="center" justifyContent="space-between">
          <MyRating id={id} index={index} stars={stars || 0} />
          <FlexBox alignItems="center">
            <Checkbox checked={currentIsReadLater} onChange={handleIsReadLater} />
            <span>{t('Read Later')}</span>
          </FlexBox>
        </FlexBox>

        <SpacerDivider spacing={1} />

        <EmbedPlayer data={embeddable} />

        {/* {html && (
            <div ref={ref}>
              <Interweave content={html} />
            </div>
          )} */}

        {data && data._source && data._source.html && (
          <div ref={ref} dangerouslySetInnerHTML={{ __html: data._source.html }} />
        )}
      </FlexBox>
    </div>
  );
}

export default ReadableArticle;
