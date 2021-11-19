import { createRef } from 'preact';

import { FileCopy } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { setImportResults } from 'src/redux/slices/importSlice';
import { useAppDispatch } from 'src/redux/store';

function ImportFromHtmlButton(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const uploadInputRef = createRef<HTMLInputElement>();

  const handleHtmlImport = (
    // event: JSXInternal.TargetedEvent<HTMLInputElement, Event>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && e.target.result) {
          const text = e.target.result.toString();
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const urls: string[] = [];
          doc.querySelectorAll('a').forEach((l) => {
            urls.push(l.href);
          });
          dispatch(setImportResults(urls));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleOnClick = () => {
    uploadInputRef.current && uploadInputRef.current.click();
  };

  return (
    <>
      <input
        ref={uploadInputRef}
        accept=".html"
        type="file"
        id="icon-button-file"
        style={{ display: 'none' }}
        onChange={(e) => handleHtmlImport(e)}
      />
      <Button
        onClick={handleOnClick}
        variant="contained"
        color="primary"
        startIcon={<FileCopy />}>
        {t('Import')}
      </Button>
    </>
  );
}

export default ImportFromHtmlButton;
