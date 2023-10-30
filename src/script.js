// Variables to hold plateau size, initial position, rover instructions, rover coordinates, and orientation
let plateauSize, initialPosition, roverInstructions
let roverX, roverY, roverOrientation

// Function to set the plateau size
function setPlateau() {
    // Get the plateau size input value from the HTML element
    plateauSize = document.getElementById('plateauSize').value

    // Trim any leading or trailing spaces from the input
    plateauSize = plateauSize.trim()

    // If plateauSize does not contain a space and has a length of 2
    if (!plateauSize.includes(' ') && plateauSize.length === 2) {
        // Split the string into two halves and insert a space in between
        const firstHalf = plateauSize.slice(0, Math.ceil(plateauSize.length / 2))
        const secondHalf = plateauSize.slice(Math.ceil(plateauSize.length / 2))
        plateauSize = `${firstHalf} ${secondHalf}`
    }

    // Regular expression to validate plateauSize format (X Y)
    const plateauSizeRegex = /^\d+\s\d+$/

    // If the format does not match, show an alert message
    if (!plateauSizeRegex.test(plateauSize)) {
        alert('Please provide plateau size in the format "X Y"')
        return
    }
    createPlateauGrid()
}

// Function to create coordinate lines on the grid
function createCoordinateLines() {
    // Get the plotter element from the HTML
    const plotterElement = document.getElementById('plotter')

    // Destructure plateauX and plateauY from plateauSize after converting them to numbers
    const [plateauX, plateauY] = plateauSize.split(' ').map(Number)

    // Create vertical coordinate lines
    for (let x = 1; x < plateauX; x++) {
        // Create a div element for the vertical line
        const line = document.createElement('div')

        // Add classes for styling (coordinate-line and vertical)
        line.classList.add('coordinate-line', 'vertical')

        // Set the left position of the line based on the grid percentage
        line.style.left = `${(x / plateauX) * 100}%`

        // Append the line to the plotter element
        plotterElement.appendChild(line)
    }

    // Create horizontal coordinate lines
    for (let y = 1; y < plateauY; y++) {
        // Create a div element for the horizontal line
        const line = document.createElement('div')

        // Add classes for styling (coordinate-line and horizontal)
        line.classList.add('coordinate-line', 'horizontal')

        // Set the top position of the line based on the grid percentage
        line.style.top = `${(y / plateauY) * 100}%`

        // Append the line to the plotter element
        plotterElement.appendChild(line)
    }
}

// Function to set the rover's initial position
function setRoverPosition() {
    // Get the initial position input value from the HTML
    initialPosition = document.getElementById('initialPosition').value

    // Trim any extra spaces from the input
    initialPosition = initialPosition.trim()

    // Define a regular expression to validate the format of the input
    const regex = /^[0-9][0-9][nesw]$/i

    // Check if the input is valid
    if (initialPosition.length > 3 || !regex.test(initialPosition)) {
        // Show an alert for invalid input
        alert('Please enter a valid position in the format "0 0 N".')
        return
    }

    // Check if there are no spaces and the length is 3 (e.g., "00n")
    if (!initialPosition.includes(' ') && initialPosition.length === 3) {
        // Format the input to "0 0 N" and convert to uppercase
        initialPosition = initialPosition.replace(/(\d)(\d)([nesw])/i, '$1 $2 $3').toUpperCase()
    }

    // Split the formatted input into x, y, and orientation
    const [x, y, orientation] = initialPosition.split(' ')

    // Convert x and y to integers and set the rover's orientation
    roverX = parseInt(x)
    roverY = parseInt(y)
    roverOrientation = orientation

    // Render the rover's position on the grid
    renderRover()
}

function setRoverInstructions() {
    roverInstructions = document.getElementById('roverInstructions').value.toUpperCase()

    const validCommands = /^[LMR]*$/ // Expressão regular para aceitar apenas L, M ou R

    if (!validCommands.test(roverInstructions)) {
        alert('Please enter valid instructions using only L, M or R.')
    }
}

// Function to create a grid representing the plateau
function createPlateauGrid() {
    // Get the plotter element from the HTML
    const plotterElement = document.getElementById('plotter')

    // Extract plateau dimensions from the plateauSize string and convert them to numbers
    const [plateauX, plateauY] = plateauSize.split(' ').map(Number)

    // Clear any existing content in the plotter element
    plotterElement.innerHTML = ''

    // Loop through rows (y-coordinate) of the grid in reverse order
    for (let y = plateauY - 1; y >= 0; y--) {
        // Loop through columns (x-coordinate) of the grid
        for (let x = 0; x < plateauX; x++) {
            // Create a grid square element
            const gridSquare = document.createElement('div')

            // Set the class name of the grid square for styling
            gridSquare.className = 'grid-square'

            // Append the grid square to the plotter element
            plotterElement.appendChild(gridSquare)
        }
    }

    // Create coordinate lines on the grid
    createCoordinateLines()
}

// Function to render the rover on the plateau
function renderRover() {
    // Get the plotter element from the HTML
    const plotterElement = document.getElementById('plotter')

    // Remove any existing rover elements
    plotterElement.querySelectorAll('.rover').forEach(rover => rover.remove())

    // Create a new element for the rover
    const roverElement = document.createElement('div')
    roverElement.classList.add('rover')

    // Calculate the rotation angle based on the rover's orientation
    const rotation = getRotationAngle()

    // Set the transform property to rotate the rover
    roverElement.style.transform = `rotate(${rotation}deg)`

    // Set the top position of the rover based on its y-coordinate and plateau height
    roverElement.style.top = `${100 - (roverY / parseInt(plateauSize.split(' ')[1]) * 100)}%`

    // Set the left position of the rover based on its x-coordinate and plateau width
    roverElement.style.left = `${(roverX / parseInt(plateauSize.split(' ')[0]) * 100)}%`

    // Create a text element to display the rover's orientation
    const roverText = document.createElement('div')
    roverText.classList.add('rover-text')
    roverText.textContent = roverOrientation

    // Append the text element to the rover element
    roverElement.appendChild(roverText)

    // Append the rover element to the plotter
    plotterElement.appendChild(roverElement)

    // Update the result element with the current position and orientation of the rover
    const resultElement = document.getElementById('result')
    resultElement.textContent = `Current Position: ${roverX} ${roverY} ${roverOrientation}`
}

// Function to explore the plateau based on rover instructions
function explorePlateau() {
    // Check if rover instructions are set
    if (!roverInstructions) {
        alert('Please set rover instructions first.')
        return
    }

    // Loop through each instruction in roverInstructions
    for (const instruction of roverInstructions) {
        // Use a switch statement to handle different instructions
        switch (instruction) {
            case 'L':
                turnLeft() // Turn the rover left
                break
            case 'R':
                turnRight() // Turn the rover right
                break
            case 'M':
                moveForward() // Move the rover forward
                break
        }
    }

    // After executing instructions, render the updated rover position
    renderRover()
}

// Function to turn the rover left based on its current orientation
function turnLeft() {
    switch (roverOrientation) {
        case 'N':
            roverOrientation = 'W' // If facing North, turn to West
            break
        case 'W':
            roverOrientation = 'S' // If facing West, turn to South
            break
        case 'S':
            roverOrientation = 'E' // If facing South, turn to East
            break
        case 'E':
            roverOrientation = 'N' // If facing East, turn to North
            break
    }
}

// Function to turn the rover right based on its current orientation
function turnRight() {
    switch (roverOrientation) {
        case 'N':
            roverOrientation = 'E' // If facing North, turn to East
            break
        case 'E':
            roverOrientation = 'S' // If facing East, turn to South
            break
        case 'S':
            roverOrientation = 'W' // If facing South, turn to West
            break
        case 'W':
            roverOrientation = 'N' // If facing West, turn to North
            break
    }
}

// Function to move the rover forward based on its current orientation
function moveForward() {
    switch (roverOrientation) {
        case 'N':
            if (roverY < parseInt(plateauSize.split(' ')[1])) roverY += 1 // Move North if within plateau bounds
            break
        case 'E':
            if (roverX < parseInt(plateauSize.split(' ')[0])) roverX += 1 // Move East if within plateau bounds
            break
        case 'S':
            if (roverY > 0) roverY -= 1 // Move South if within plateau bounds
            break
        case 'W':
            if (roverX > 0) roverX -= 1 // Move West if within plateau bounds
            break
    }
}

// Function to determine the rotation angle of the rover based on its current orientation
function getRotationAngle() {
    switch (roverOrientation) {
        case 'N':
            return 0 // No rotation if facing North
        case 'E':
            return 90 // Rotate 90 degrees if facing East
        case 'S':
            return 180 // Rotate 180 degrees if facing South
        case 'W':
            return -90 // Rotate -90 degrees if facing West
        default:
            return 0 // Default to no rotation
    }
}

