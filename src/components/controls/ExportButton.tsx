import type { estypes } from '@elastic/elasticsearch';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { INDEX_NAME } from 'src/constants';
import { formatDate, makeNetscapeBookmarksHtml } from 'src/libs/utils';
import {
  useClosePitMutation,
  useExportMutation,
  useOpenPitMutation,
} from 'src/redux/services/elasticsearch/api';
import type { BookmarkResponse, UrlAndTitle } from 'src/types';

function ExportButton(): JSX.Element {
  const { t } = useTranslation();
  const [getExport, {}] = useExportMutation();
  const [openPit, {}] = useOpenPitMutation();
  const [closePit, {}] = useClosePitMutation();

  const handleExport = async () => {
    try {
      const keepAlive = '1m';
      const pitResponse = await openPit({
        index: `${INDEX_NAME}*`,
        keep_alive: keepAlive,
      }).unwrap();
      const pitId = pitResponse.id;

      const hits: estypes.SearchHit<Pick<BookmarkResponse, 'url' | 'title'>>[] = [];
      const getRecursiveHits = async (after?: estypes.SearchSortResults | undefined) => {
        const response = await getExport({
          size: 10000,
          body: {
            pit: {
              id: pitId,
              keep_alive: keepAlive,
            },
            search_after: after,
          },
        }).unwrap();
        hits.push(...response.hits.hits);
        const length = response.hits.hits.length;
        if (length !== 0) {
          const searchAfter = response.hits.hits[length - 1].sort;
          await getRecursiveHits(searchAfter);
        }
      };
      await getRecursiveHits();

      const bookmarks: UrlAndTitle[] = [];
      hits.forEach((hit) => {
        if (hit._source) {
          const item: UrlAndTitle = {
            url: hit._source.url,
            title: hit._source.title,
          };
          bookmarks.push(item);
        }
      });

      // ! close pit
      await closePit({
        body: {
          id: pitId,
        },
      });

      const html = makeNetscapeBookmarksHtml(bookmarks);
      const blob = new Blob([html], { type: 'text/html' });
      const dateStr = formatDate(new Date(), 'yyyy-MM-dd');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `researcher-bookmark-${dateStr}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      // TODO: shuold show global Alert with redux dispatch
      // console.log(e);
    }
  };

  return (
    <Button variant="contained" onClick={handleExport}>
      {t('Export')}
    </Button>
  );
}

export default ExportButton;
