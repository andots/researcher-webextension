import { useEffect, useState } from 'react';

import { Link, Box } from '@mui/material';
import { useMountedState, useUnmount } from 'react-use';

type Props = {
  url: string;
  width: string | number;
  height: string | number;
  imageUrl?: string;
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

const NO_IMAGE = '/assets/no_image.png';

function ThumbnailLink({ url, imageUrl, width, height }: Props): JSX.Element {
  const [src, setSrc] = useState<string>(imageUrl ? imageUrl : NO_IMAGE);
  const [ready, setReady] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const isMounted = useMountedState();

  useEffect(() => {
    const call = async () => {
      try {
        await loadImage(src);
      } catch {
        setSrc(NO_IMAGE);
      } finally {
        if (isMounted()) {
          setReady(true);
        }
      }
    };
    call();
  }, [src, isMounted]);

  useUnmount(() => {
    setReady(false);
    setIsLoaded(false);
  });

  const handleOnLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Box
      sx={{
        width,
        height,
      }}>
      {ready ? (
        <Link href={url} target="_blank" rel="noopener">
          <img
            src={src}
            style={{
              width,
              height,
              objectFit: 'cover',
              transition: '1s',
              opacity: isLoaded ? 1 : 0,
            }}
            onLoad={handleOnLoad}
          />
        </Link>
      ) : (
        <Box
          sx={{
            height: 0,
            overflow: 'hidden',
            paddingTop: '59%',
            position: 'relative',
          }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default ThumbnailLink;
