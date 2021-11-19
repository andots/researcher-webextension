import { GitHub } from '@mui/icons-material';

type Props = {
  site: string;
  size: number;
};

function Favicon({ site, size }: Props): JSX.Element {
  // const src = `https://icons.duckduckgo.com/ip3/${site}.ico`;
  const src = `https://www.google.com/s2/favicons?domain=${site}&sz=24`;

  const Icon = () => {
    // ! Set material-ui GitHub icon because google favicon api can't get github favicon
    if (site.includes('github.com')) {
      return <GitHub style={{ width: size, height: size }} />;
    }
    return <img src={src} style={{ width: size, height: size, objectFit: 'cover' }} />;
  };

  return (
    <div style={{ width: size, height: size }}>
      <Icon />
    </div>
  );
}

export default Favicon;
