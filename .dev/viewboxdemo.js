document.addEventListener("DOMContentLoaded",function(){
var container = document.querySelector('.chart');

container.addEventListener('click', popOut, false)
});

window.popOut =function popOut() {
var container = document.querySelector('.chart');
var button = document.querySelector('button');

if (container.className.split(/\s+/).indexOf("popper") === -1) {
container.classList.add('popper');
button.innerHTML = 'Back';
} else {
container.classList.remove('popper');
button.innerHTML = 'Pop Out';
}

var svg = document.querySelector('svg');
}
