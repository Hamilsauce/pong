const _SVG_NS = 'http://www.w3.org/2000/svg';

// CIRCLE
export default class {
	constructor(pos, color, graph) {
		this.graph = graph;
		this.el = document.createElementNS(_SVG_NS, 'rect');
		this.el.classList.add('rect');
		this.el.setAttributeNS(null,'stroke-width', '2');
		this.el.setAttributeNS(null,'stroke', color);
		this.el.setAttributeNS(null, 'fill', color);
		
		// this.el.setAttributeNS(null, 'stroke-width', '2');
		// this.el.setAttributeNS(null, 'stroke-fill', 'red');
		// this.el.setAttribute(null, 'fill', color);
		this.setCoords(pos);
		this.setSize(pos);
		this.el.addEventListener('click', this.handleClick.bind(this));
	}

	handleClick(e) {
		if (this.graph.selectMode) {
			const evt = new CustomEvent('shapeSelected', { bubbles: true, detail: { event: e } })
			e.target.dispatchEvent(evt);
			console.log('shape click w select mide on', evt);
		}
	}

	setCoords(pos) {
		this.el.setAttribute('x', pos.x);
		this.el.setAttribute('y', pos.y);
	}

	setSize(width, height) {
		this.el.setAttribute('width', width);
		this.el.setAttribute('height', height);
	}

	getPosition() {
		return {
			x: this.el.getAttribute('x'),
			y: this.el.getAttribute('y'),
			width: this.el.getAttribute('width'),
			height: this.el.getAttribute('height'),
		}
	}

	setRotate(angle) {
		let newPos = pos = this.getPosition();
		newPos.x2 = pos - radius * Math.cos(angle);
		newPos.y2 = pos - radius * Math.sin(angle);
		this.setPosition(newPos);
	}

	getHtmlEl() {
		return this.el;
	}
}
