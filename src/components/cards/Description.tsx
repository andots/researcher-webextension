import { Markup } from 'interweave';

type Props = {
  highlight?: Record<string, string[]>;
};

function Description({ highlight }: Props): JSX.Element {
  if (highlight?.content) {
    return (
      <Markup containerTagName="div" content={highlight.content[0]} allowList={['b']} />
    );
  }

  return <></>;
}

export default Description;
