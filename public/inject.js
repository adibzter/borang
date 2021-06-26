const submitUrl = 'https://desperate.skrin.xyz/submit';
// const submitUrl = 'http://localhost:5000/submit';

const form = document.querySelector('form');
const formUrl = form.action;

form.method = 'POST';
form.action = submitUrl;

const submitButton = document.querySelector(
  '.freebirdFormviewerViewNavigationSubmitButton'
);
// submitButton.removeAttribute('jsaction');
submitButton.addEventListener('click', async (e) => {
  const counter = +prompt('How many time you want to submit this form?');
  if (!counter) {
    alert('Please enter a number');
    return;
  }
  submitForm(formUrl, counter);
});

function submitForm(formUrl, submitNumber) {
  const url = document.createElement('input');
  url.type = 'hidden';
  url.setAttribute('name', 'url');
  url.value = formUrl;
  form.appendChild(url);

  const counter = document.createElement('input');
  counter.type = 'hidden';
  counter.setAttribute('name', 'counter');
  counter.value = submitNumber;
  form.appendChild(counter);

  form.submit();
}
