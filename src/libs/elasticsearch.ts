import type { SearchTotalHits } from '@elastic/elasticsearch/api/types';

export const getSearchTotalHits = (totalHits: number | SearchTotalHits): number => {
  if (typeof totalHits === 'number') {
    return totalHits;
  } else if (typeof totalHits === 'object' && 'value' in totalHits) {
    return totalHits.value;
  }
  return 0;
};
