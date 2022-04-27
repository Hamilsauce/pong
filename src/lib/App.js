import EventBus from '../EventBus.js';
import Graph from './Graph.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'
const { DOM } = ham

// APP
export default class {
  constructor(graphEl) {
    this.root = document.querySelector('#app')
    this.graph = new Graph(graphEl);

    this.options = [
      ['drawRectToggle', DOM.qs('#draw-rect-toggle')],
      ['selectModeToggle', DOM.qs('#select-mode-toggle')],
      ['shapeColorPicker', DOM.qs('#shape-color-picker')],
      ['undoButton', DOM.qs('#undo-button')],
      ['redoButton', DOM.qs('#redo-button')],
    ];

    this.els = {
      'drawRectToggle': DOM.qs('#draw-rect-toggle'),
      'selectModeToggle': DOM.qs('#select-mode-toggle'),
      'shapeColorPicker': DOM.qs('#shape-color-picker'),
      'undoButton': DOM.qs('#undo-button'),
      'deleteButton': DOM.qs('#delete-button'),
      'redoButton': DOM.qs('#redo-button'),
      'addEdgeConfirmButton': DOM.qs('#add-edge-confirm-button'),
      'addEdgeButton': DOM.qs('#add-edge-button'),
    }

    this.optionChangeBus = new EventBus(this.els);
    this.root.addEventListener('option-change', this.handleOptionChange.bind(this))
  }

  handleOptionChange(e) {
    const { data, type } = e.detail
    if (typeof type != 'string' || !this.graph.optionActionMap.has(type)) return;
    this.graph.optionActionMap.get((type))([undefined, null].includes(data) ? data : data.toUpperCase());
    
    
    
  }
}