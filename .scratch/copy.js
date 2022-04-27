import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { event, date, array, utils, text, DOM } = ham;
ham.help('', 'event')
const app = document.querySelector('.app');
const controlsSvg = document.querySelector('#controls')
const circ1 = controlsSvg.querySelector('.copytarget1')
const circ2 = controlsSvg.querySelector('.copytarget2')

event.selectAllContent(circ1);

// Overwrite what is being copied to the clipboard.
// document.addEventListener('copy', function(e) {
//   // e.clipboardData is initially empty, but we can set it to the
//   // data that we want copied onto the clipboard.
//   e.clipboardData.setData('text/plain', 'Hello, world!');
//   e.clipboardData.setData('text/html', '<b>Hello, world!</b>');

//   // This is necessary to prevent the current document selection from
//   // being written to the clipboard.
//   e.preventDefault();
// });

// Overwrite what is being pasted onto the clipboard.
document.addEventListener('paste', function(e) {
  // e.clipboardData contains the data that is about to be pasted.
  if (e.clipboardData.types.indexOf('text/html') > -1) {
    var oldData = e.clipboardData.getData('text/html');
    var newData = '<b>Ha Ha!</b> ' + oldData;

    // Since we are canceling the paste operation, we need to manually
    // paste the data into the document.
    pasteClipboardData(newData);

    // This is necessary to prevent the default paste action.
    e.preventDefault();
  }
});

circ1.addEventListener("click", e => {
console.log('sex');
  let sel = e.target;
  // e.clipboardData.setData('text/plain', document.getSelection().toString().toUpperCase());

  // controlsSvg.addEventListener("click", e => {
    e.clipboardData.setData('text/html', sel)
    e.preventDefault();

    controlsSvg.addEventListener("click", e => {
      // e.clipboardData.setData('text/html', sel)
     
     pasteClipboardData(e.clipboardData.getData('text/html'));
     e.preventDefault();
    });
  // });
});