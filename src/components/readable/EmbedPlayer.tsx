import type { EmbeddableType } from 'src/types';

type Props = {
  data: EmbeddableType;
};

const EmbedPlayer = ({ data }: Props): JSX.Element => {
  const { isEmbeddable, provider, identifier } = data;
  if (isEmbeddable) {
    if (provider && identifier) {
      if (provider === 'youtube') {
        return (
          <div className="videoWrapper">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${identifier}`}
              title="YouTube video player"
              frameBorder="0"
              // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }
  }

  return <></>;
};

export default EmbedPlayer;
