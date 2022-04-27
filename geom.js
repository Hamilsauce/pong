/*
Math.sin(θ) = opposite / hypotenuse
Math.cos(θ) = adjacent / hypotenuse
Math.tan(θ) = opposite / adjacent
*/


const shape = document.querySelector('.shape')
const pointsInput = document.querySelector('[data-slider="points"]')
const pointsLabel = document.querySelector('[data-label="points"]')
const radInput = document.querySelector('[data-slider="inner-radius"]')
const radLabel = document.querySelector('[data-label="inner-radius"]')
const inputs = [radInput, pointsInput]

const size = 120

const createPolygon = () => {
  const radius = radInput.value
  const numberOfPoints = pointsInput.value
  const angleStep = (Math.PI * 2) / numberOfPoints
  const xPosition = shape.clientWidth / 2
  const yPosition = shape.clientHeight / 2

  const points = []

  for (let i = 1; i <= numberOfPoints; i++) {
    const radiusAtPoint = i % 2 === 0 ? radius : size
    const x = xPosition + Math.cos(i * angleStep) * radiusAtPoint
    const y = yPosition + Math.sin(i * angleStep) * radiusAtPoint

    points.push({ x, y })
  }

  const polygonCoordinates = points
    .map(({ x, y }) => {
      return `${x}px ${y}px`
    }).join(',')

  shape.style.setProperty('--clip', `polygon(${polygonCoordinates})`)

  pointsLabel.innerText = numberOfPoints
  radLabel.innerText = `${Math.round(radius / size * 100)}%`
}

createPolygon()

inputs.forEach((input) => {
  input.addEventListener('input', createPolygon)
})

window.addEventListener('resize', createPolygon)
