import { TreeView as MuiTreeView } from '@mui/lab';
import { useEffectOnce } from 'react-use';
import browser from 'webextension-polyfill';

import MyTreeItem from 'src/components/import/MyTreeItem';
import { setBrowserBookmarks } from 'src/redux/slices/importSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

function BrowserBookmarksTreeView(): JSX.Element {
  const dispatch = useAppDispatch();
  const browserBookmarks = useAppSelector((s) => s.import.browserBookmarks);

  useEffectOnce(() => {
    const getBookmarks = async () => {
      const bookmarks = await browser.bookmarks.getTree();
      dispatch(setBrowserBookmarks(bookmarks[0]));
    };
    if (browserBookmarks == null) {
      getBookmarks();
    }
  });

  const handleSelect = (event: React.ChangeEvent<unknown>, _nodeId: string) => {
    event.preventDefault();
  };

  if (browserBookmarks == null) {
    return <></>;
  }

  return (
    <MuiTreeView
      disableSelection
      sx={{
        flexGrow: 1,
        maxWidth: '100%',
        userSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      defaultExpanded={[browserBookmarks.id]}
      onNodeSelect={handleSelect}>
      <MyTreeItem node={browserBookmarks} />
    </MuiTreeView>
  );
}

export default BrowserBookmarksTreeView;
