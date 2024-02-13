import { useEffect, useState, useRef } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import TemplateDialog from '../components/TemplateDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUserStore } from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

const Mobile = () => {
  const [formUrl, setFormUrl] = useState('');
  const [isGettingForm, setIsGettingForm] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formCounter, setFormCounter] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const [badges] = useUserStore((state) => [state.badges]);

  const iframeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Borang | Mobile';
  }, []);

  useEffect(() => {
    if (!badges) {
      return;
    }

    if (badges.includes('skrin-premium')) {
      setIsPremium(true);
    } else {
      navigate('/');
    }
  }, [badges]);

  async function getForm() {
    if (!formUrl) {
      return;
    }

    if (
      !formUrl.startsWith('https://docs.google.com/forms/') &&
      !formUrl.endsWith('/viewform')
    ) {
      alert('Form URL is not valid');
      return;
    }

    setIsGettingForm(true);
    const response = await fetch(`/api/files`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ url: formUrl }),
    });
    const { fileId } = await response.json();
    setIframeSrc(`/api/files/${fileId}`);
    setIsGettingForm(false);
  }

  function handleIframeLoaded() {
    if (!iframeSrc) {
      return;
    }
    injectScript();
  }

  function injectScript() {
    const iframeDocument = iframeRef.current.contentDocument;
    const submitUrl = '/submit';
    // const submitUrl = 'http://localhost:5000/submit';

    let submitButton = iframeDocument.querySelector(
      // '.freebirdFormviewerViewNavigationSubmitButton'
      // '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf.NqnGTe'
      '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf'
    );

    if (!submitButton) {
      return;
    }

    const script = iframeDocument.querySelector('body > script');
    const clone = script.cloneNode(true);
    clone.setAttribute('type', 'text/javascript');

    const body = iframeDocument.querySelector('body');
    body.appendChild(clone);

    const form = iframeDocument.querySelector('form');
    const formUrl = form.action;
    form.method = 'POST';
    form.action = submitUrl;

    const borangSubmitButton = iframeDocument.createElement('button');
    borangSubmitButton.textContent = 'Submit';
    submitButton.replaceWith(borangSubmitButton);

    borangSubmitButton.onclick = async (e) => {
      e.preventDefault();
      setIsDialogOpen(true);
      const counter = +prompt('How many times should the form be submitted?');
      if (!counter) {
        alert('Please enter a number');
        return;
      }
      submitForm(iframeDocument, formUrl, counter);
      // submitForm(iframeDocument, formUrl, 32);
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
      {isPremium && (
        <Box
          component='main'
          alignItems='center'
          display='flex'
          flexDirection='column'
        >
          {/* <TemplateDialog
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
          </TemplateDialog> */}

          {!iframeSrc ? (
            <>
              <h2>Mobile</h2>
              <TextField
                id='outlined-basic'
                label='Google Form URL'
                variant='outlined'
                type='text'
                fullWidth={true}
                onChange={(e) => setFormUrl(e.target.value)}
              />
              <LoadingButton
                sx={{ marginTop: 2 }}
                variant='contained'
                loading={isGettingForm}
                onClick={getForm}
              >
                Get Form
              </LoadingButton>
            </>
          ) : (
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              id='iframe-mobile'
              frameBorder='0'
              onLoad={handleIframeLoaded}
              style={{ width: '100%', height: '600px', marginTop: '100px' }}
            ></iframe>
          )}
        </Box>
      )}
    </>
  );
};

export default Mobile;
