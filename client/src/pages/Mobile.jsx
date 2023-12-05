import { useEffect, useState, useRef } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import TemplateDialog from '../components/TemplateDialog';

const Mobile = () => {
  const [iframeSrc, setIframeSrc] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formCounter, setFormCounter] = useState(0);

  const iframeRef = useRef(null);

  useEffect(() => {
    document.title = 'Borang | Mobile';

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

  // useEffect(() => {
  //   if (!iframeSrc) {
  //     return;
  //   }

  //   const iframe = document.querySelector('#iframe-mobile');
  //   iframe.addEventListener('load', () => {
  //     injectScript(iframe.contentDocument);
  //   });
  // }, [iframeSrc]);

  function handleIframeLoaded() {
    if (!iframeSrc) {
      return;
    }
    injectScript();
  }

  function injectScript() {
    console.log('syub');
    const iframeDocument = iframeRef.current.contentDocument;
    const submitUrl = '/submit';
    // const submitUrl = 'http://localhost:5000/submit';

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

    const broButton = iframeDocument.createElement('button');
    broButton.textContent = 'Submit bro';
    broButton.onclick = () => {
      submitForm(iframeDocument, formUrl, 32);
    };
    form.appendChild(broButton);

    submitButton.onclick = async () => {
      setIsDialogOpen(true);
      // const counter = +prompt('How many time you want to submit this form?');
      // if (!counter) {
      //   alert('Please enter a number');
      //   return;
      // }
      // submitForm(iframeDocument, formUrl, counter);
      submitForm(iframeDocument, formUrl, 32);
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

    form.querySelectorAll('input').forEach((i) => {
      console.log('form', i);
    });
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
        <TemplateDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        >
          <Grid sx={{ margin: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ marginBottom: 2 }}>
              How many time you want to submit this form?
            </Typography>
            <TextField
              id='outlined-basic'
              label='Number of submission'
              variant='outlined'
              type='number'
              onChange={(e) => setFormCounter(e.target.value)}
            />
          </Grid>
        </TemplateDialog>

        <iframe
          ref={iframeRef}
          src={iframeSrc}
          id='iframe-mobile'
          frameBorder='0'
          width='100%'
          height='600px'
          onLoad={handleIframeLoaded}
        ></iframe>
      </Box>
    </>
  );
};

export default Mobile;
