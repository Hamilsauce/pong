const ShapeTypeMap = new Map()

export class Spatial {
  constructor({ parentSVG, type, attrs }) {
    this.attrs = attrs;
    this._parentSVG = parentSVG;
    this.root = document.createElementNS(this.namespaceURI, type)

    Object.assign(this, attrs)

    this.rootTransforms = this.root.transform.baseVal;
    
    if (this.rootTransforms.length === 0) {
      this.rootTranslate = this.parentSVG.createSVGTransform();
      this.rootTranslate.setTranslate(0, 0);
      this.rootTransforms.insertItemBefore(this.rootTranslate, 0);
    }
  }

  createSVGTransform() { return this.parentSVG.createSVGTransform() }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }
  
  get dataset() { return this.root.dataset }
  
  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.root.dataset[prop] = value) }
  
  get classList() { return this.root.classList }
  
  set classList(val) { this.root.classList.add(...val) }
  
  get id() { return this.root.id }
  
  set id(val) { this.root.id = val }
  
  get parentSVG() { return this._parentSVG }
  
  set parentSVG(val) { this._parentSVG = val }
  
  get radiusX() { return this.width / 2 }
  
  get radiusY() { return this.height / 2 }
  
  get centroid() {
    return {
      x: this.x ? this.x + this.radiusX:this.cx + this.radiusX,
      y: this.y ? this.y + this.radiusY:this.cy + this.radiusY,
      y: this.y + this.radiusY,
    }
  }
  
  get x() { try { return this.root.x.baseVal.value } catch (e) { return null } }
  
  set x(val) { this.root.x.baseVal.value = val }
  
  get y() { try { return this.root.y.baseVal.value } catch (e) { return null } }
  
  set y(val) { this.root.y.baseVal.value = val }
  
  get cx() { try { return this.root.cx.baseVal.value } catch (e) { return null } }
  
  set cx(val) { this.root.cx.baseVal.value = val }
  
  get cy() { try { return this.root.cy.baseVal.value } catch (e) { return null } }
  
  set cy(val) { this.root.cy.baseVal.value = val }
  
  get r() { try { return this.root.r.baseVal.value } catch (e) { return null } }
  
  set r(val) { this.root.r.baseVal.value = val }
  
  get height() { try { return this.root.height.baseVal.value } catch (e) { return null } }
  
  set height(val) { this.root.height.baseVal.value = val }
  
  get width() { try { return this.root.width.baseVal.value } catch (e) { return null } }
  
  set width(val) { this.root.width.baseVal.value = val }
  
  get x1() { return this.root.x1.baseVal.value || 0 }
  
  set x2(val) { this.root.x2.baseVal.value = val }
  
  get y1() { return this.root.y1.baseVal.value || 0 }
  
  set y2(val) { this.root.y2.baseVal.value = val }
  
  get fill() { return this.root.getAttribute('fill') }
  
  set fill(val) { this.root.setAttribute('fill', val) }
}