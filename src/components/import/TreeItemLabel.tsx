import { FolderOpenSharp } from '@mui/icons-material';
import { Box, Checkbox, Link } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import LineClamp from 'src/components/atoms/LineClamp';
import { isWebUrl } from 'src/libs/utils';
import type { BrowserBookmarksType } from 'src/types';

type Props = {
  node: BrowserBookmarksType;
};

const TreeItemLabel = ({ node }: Props): JSX.Element => {
  const { url, type } = node;
  const title = node.parentId ? node.title : 'Browser Bookmarks';

  if (url && !isWebUrl(url)) {
    return <></>;
  }

  if (type === 'folder') {
    return (
      <FlexBox
        flexDirection="row"
        alignItems="center"
        style={{ marginTop: 4, marginBottom: 4, height: 50 }}>
        {node.children && node.children.length > 0 && (
          <FlexBox>
            <Checkbox
              color="primary"
              tabIndex={-1}
              disableRipple
              checked={node.checked}
            />
          </FlexBox>
        )}
        <Box mr={1} />
        <FolderOpenSharp />
        <Box mr={1} />
        <LineClamp lineClamp={1}>
          <Box>{title === '' ? 'No Name' : title}</Box>
        </LineClamp>
      </FlexBox>
    );
  }

  return (
    <FlexBox
      flexDirection="row"
      alignItems="center"
      style={{ marginTop: 4, marginBottom: 4, height: 50 }}>
      <FlexBox>
        <Checkbox color="primary" checked={node.checked} tabIndex={-1} disableRipple />
      </FlexBox>
      <FlexBox flexDirection="column">
        <FlexBox flexDirection="row">
          <LineClamp lineClamp={1}>
            <Box>{title === '' ? 'No Name' : title}</Box>
          </LineClamp>
        </FlexBox>
        <Box>
          <LineClamp lineClamp={1}>
            <Link
              href={url}
              target="_blank"
              rel="noopener"
              variant="body1"
              color="primary">
              {url}
            </Link>
          </LineClamp>
        </Box>
      </FlexBox>
    </FlexBox>
  );
};

export default TreeItemLabel;
