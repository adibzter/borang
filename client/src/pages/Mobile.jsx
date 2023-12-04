import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

const Mobile = () => {
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    document.title = 'Borang | Mobile';
    console.log('hey');

    (async () => {
      const url = `https://docs.google.com/forms/d/e/1FAIpQLSdlDcXOLEzToHOMWM2SnP0Ux5lQURvWvk_Ijt-ZfOMVwIH_GQ/viewform`;

      const response = await fetch(`/api/files`, {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      const { fileId } = await response.json();
      setIframeSrc(`/api/files/${fileId}`);
    })();
  }, []);

  useEffect(() => {
    if (!iframeSrc) {
      return;
    }

    const iframe = document.querySelector('#iframe-mobile');
    iframe.addEventListener('load', () => {
      injectScript(iframe.contentDocument);
    });
  }, [iframeSrc]);

  function injectScript(iframeDocument) {
    // const submitUrl = 'https://borang.skrin.xyz/submit';
    const submitUrl = 'http://localhost:5000/submit';

    let submitButton = iframeDocument.querySelector(
      // '.freebirdFormviewerViewNavigationSubmitButton'
      // '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf.NqnGTe'
      '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf'
    );

    const script = iframeDocument.querySelector('body > script');
    const clone = script.cloneNode(true);
    clone.setAttribute('type', 'text/javascript');

    const body = iframeDocument.querySelector('body');
    body.appendChild(clone);

    const form = iframeDocument.querySelector('form');
    const formUrl = form.action;
    form.method = 'POST';
    form.action = submitUrl;

    submitButton.onclick = async () => {
      const counter = +prompt('How many time you want to submit this form?');
      if (!counter) {
        alert('Please enter a number');
        return;
      }
      submitForm(iframeDocument, formUrl, counter);
    };
  }

  function submitForm(iframeDocument, formUrl, submitNumber) {
    const url = iframeDocument.createElement('input');
    url.type = 'hidden';
    url.setAttribute('name', 'url');
    url.value = formUrl;

    const form = iframeDocument.querySelector('form');
    form.appendChild(url);

    const counter = iframeDocument.createElement('input');
    counter.type = 'hidden';
    counter.setAttribute('name', 'counter');
    counter.value = submitNumber;
    form.appendChild(counter);

    form.submit();
  }

  return (
    <>
      <ResponsiveAppBar />
      <Box
        component='main'
        alignItems='center'
        justifyContent='center'
        display='flex'
        minHeight='90vh'
        marginTop='20px'
        flexDirection='column'
      >
        <iframe
          src={iframeSrc}
          // src='a.html'
          id='iframe-mobile'
          frameBorder='0'
          width='100%'
          height='600px'
        ></iframe>
      </Box>
    </>
  );
};

export default Mobile;
