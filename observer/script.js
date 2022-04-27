import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { ObserverList } from './ObserverList.js';
import { Observer } from './Observer.js';
import { Subject } from './Subject.js';

const { date, array, utils, text } = ham;

// Extend an object with an extension
function extend(obj, extension) {
  for (let key in extension) {
    obj[key] = new extension.constructor()[key];

  }
}

let subjectCheckbox = document.getElementById("mainCheckbox");
  let addBtn = document.getElementById("addNewObserver");
  let container = document.getElementById("observersContainer");

let counter = 0;
let counter2 = 0;

const timerSubject = new Subject()

setInterval(() => {
  timerSubject.emit(counter)
  counter++
}, 600);

setInterval(() => {
  timerSubject.emit(counter2)
  counter2++
}, 2300);

setInterval(() => {
  let obsConfig = {
    newObserver: document.createElement("div"),
    subject: timerSubject,
    extension: Observer
  };

  createObserver(obsConfig, value => {
    container.appendChild(obsConfig.newObserver);
    obsConfig.newObserver.textContent = `BIG MAN - Value: ${value},Counter 2: ${counter2}, Counter 1: ${counter}`;

  });
  
  obsConfig.subject.subscribe(obsConfig.newObserver);
  console.log({timerSubject});
}, 2000);



const createObserver = ({ subject, newObserver, extension }, updateFunction) => {
  let display = document.createElement("div");
 
  extend(newObserver, new extension());
  newObserver.update = updateFunction
  subject.subscribe(newObserver);
}

// Extend the controlling checkbox with the Subject class
extend(subjectCheckbox, new Subject());



// Clicking the checkbox will trigger notifications to its observers
subjectCheckbox.onclick = function() {
  subjectCheckbox.emit(subjectCheckbox.checked);
};

addBtn.onclick = addNewObserver.bind(subjectCheckbox);

// Concrete Observer

function addNewObserver() {

  // Create a new checkbox to be added
  let check = document.createElement("input");
  check.type = "checkbox";

  // Extend the checkbox with the Observer class
  extend(check, new Observer());

  // Override with custom update behaviour
  check.update = function(value) {
    this.checked = value;
  };

  // Add the new observer to our list of observers
  // for our main subject
  subjectCheckbox.subscribe(check);

  // Append the item to the container
  container.appendChild(check);
}
