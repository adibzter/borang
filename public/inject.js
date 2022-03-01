const submitUrl = 'https://borang.skrin.xyz/submit';
// const submitUrl = 'http://localhost:5000/submit';

let script = document.querySelector('body > script');
let clone = script.cloneNode(true);
clone.setAttribute('type', 'text/javascript');
let body = document.querySelector('body');
body.appendChild(clone);

// Remove scripts that disturb us
// const scripts = document.querySelectorAll('body > script');
// scripts.forEach((script) => {
//   script.remove();
// });

const form = document.querySelector('form');
const formUrl = form.action;

form.method = 'POST';
form.action = submitUrl;

const submitButton = document.querySelector(
  // '.freebirdFormviewerViewNavigationSubmitButton'
  '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf.NqnGTe'
);
// submitButton.removeAttribute('jsaction');
submitButton.onclick = async (e) => {
  const str = 'How many time you want to submit this form?';
  let counter = prompt(str);
  counter = /^[1-9]\d*$/.exec(counter) || 1;

  if (!counter) {
    alert('Please enter a number');
    return;
  }
  submitForm(formUrl, counter);
};

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
