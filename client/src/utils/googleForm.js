// Wait util
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitFormAwait = async (formUrl, body) => {
  await fetch(formUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
};

export const submitFormFree = async (formUrl, body) => {
  await wait(800);
  await submitFormAwait(formUrl, body);
};

export const submitFormPremium = async (formUrl, body, speed) => {
  if (speed === 0) {
    await submitFormAwait(formUrl, body);
    return null;
  }

  let waitTime;
  if (speed === 50) {
    waitTime = 60;
  } else if (speed === 100) {
    waitTime = 15;
  }

  await wait(waitTime);
  fetch(formUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
};
