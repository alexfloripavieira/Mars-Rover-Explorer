let plateauSize, initialPosition, roverInstructions
let roverX, roverY, roverOrientation

function setPlateau() {
    plateauSize = document.getElementById('plateauSize').value
    createPlateauGrid()
}

function createCoordinateLines() {
    const plotterElement = document.getElementById('plotter')
    const [plateauX, plateauY] = plateauSize.split(' ').map(Number)

    // Adicione linhas verticais
    for ( x = 1; x < plateauX; x++) {
        const line = document.createElement('div')
        line.classList.add('coordinate-line', 'vertical')
        line.style.left = `${(x / plateauX) * 100}%`
        plotterElement.appendChild(line)
    }

    // Adicione linhas horizontais
    for (y = 1; y < plateauY; y++) {
        const line = document.createElement('div')
        line.classList.add('coordinate-line', 'horizontal')
        line.style.top = `${(y / plateauY) * 100}%`
        plotterElement.appendChild(line)
    }
}

function setRoverPosition() {
    initialPosition = document.getElementById('initialPosition').value
    const [x, y, orientation] = initialPosition.split(' ')
    roverX = parseInt(x)
    roverY = parseInt(y)
    roverOrientation = orientation
    renderRover()
}

function setRoverInstructions() {
    roverInstructions = document.getElementById('roverInstructions').value
}

function createPlateauGrid() {
    const plotterElement = document.getElementById('plotter')
    const [plateauX, plateauY] = plateauSize.split(' ').map(Number)
    plotterElement.innerHTML = ''

    for (y = plateauY - 1; y >= 0; y--) {
        for (let x = 0; x < plateauX; x++) {
          const gridSquare = document.createElement('div')
          gridSquare.className = 'grid-square'
            plotterElement.appendChild(gridSquare)
        }
    }
    createCoordinateLines()
}

function renderRover() {
    const plotterElement = document.getElementById('plotter')
    plotterElement.querySelectorAll('.rover').forEach(rover => rover.remove())

    const roverElement = document.createElement('div')
    roverElement.classList.add('rover')
    const rotation = getRotationAngle()
    roverElement.style.transform = `rotate(${rotation}deg)`
    roverElement.style.top = `${100 - (roverY / parseInt(plateauSize.split(' ')[1]) * 100)}%`
    roverElement.style.left = `${(roverX / parseInt(plateauSize.split(' ')[0]) * 100)}%`

    const roverText = document.createElement('div')
    roverText.classList.add('rover-text')
    roverText.textContent = roverOrientation
    roverElement.appendChild(roverText)

    plotterElement.appendChild(roverElement)
}

function explorePlateau() {
    if (!roverInstructions) {
        alert('Please set rover instructions first.')
        return
    }

    for (const instruction of roverInstructions) {
        switch (instruction) {
            case 'L':
                turnLeft()
                break
            case 'R':
                turnRight()
                break
            case 'M':
                moveForward()
                break
        }
    }

    renderRover()
}

function turnLeft() {
    switch (roverOrientation) {
        case 'N':
            roverOrientation = 'W'
            break
        case 'W':
            roverOrientation = 'S'
            break
        case 'S':
            roverOrientation = 'E'
            break
        case 'E':
            roverOrientation = 'N'
            break
    }
}

function turnRight() {
    switch (roverOrientation) {
        case 'N':
            roverOrientation = 'E'
            break
        case 'E':
            roverOrientation = 'S'
            break
        case 'S':
            roverOrientation = 'W'
            break
        case 'W':
            roverOrientation = 'N'
            break
    }
}

function moveForward() {
    switch (roverOrientation) {
        case 'N':
            if (roverY < parseInt(plateauSize.split(' ')[1])) roverY += 1
            break
        case 'E':
            if (roverX < parseInt(plateauSize.split(' ')[0])) roverX += 1
            break
        case 'S':
            if (roverY > 0) roverY -= 1
            break
        case 'W':
            if (roverX > 0) roverX -= 1
            break
    }
}

function getRotationAngle() {
    switch (roverOrientation) {
        case 'N':
            return 0
        case 'E':
            return 90
        case 'S':
            return 180
        case 'W':
            return -90
        default:
            return 0
    }
}