import { useEffect, useState } from 'react';

import { Rating } from '@mui/material';

import { useUpdateBookmarkMutation } from 'src/redux/services/elasticsearch/api';
import { updateSearchHit } from 'src/redux/slices/searchSlice';
import { useAppDispatch } from 'src/redux/store';

type Props = {
  id: string;
  index: string;
  stars: number;
};

function MyRating({ id, index, stars }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number | null>(stars || null);
  const [updateBookmark, {}] = useUpdateBookmarkMutation();

  // ! setRating if stars prop changes
  useEffect(() => {
    setRating(stars);
  }, [stars]);

  const handleRating = (value: number | null) => {
    if (value) {
      updateBookmark({ id, index, body: { doc: { stars: value } } });
      setRating(value);
      dispatch(updateSearchHit({ id, index, patch: { stars: value } }));
    } else {
      // ! set 0 if null is given
      updateBookmark({ id, index, body: { doc: { stars: 0 } } });
      setRating(0);
      dispatch(updateSearchHit({ id, index, patch: { stars: 0 } }));
    }
  };

  return <Rating value={rating} onChange={(_e, value) => handleRating(value)} />;
}

export default MyRating;
