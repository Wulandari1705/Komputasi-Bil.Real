document.addEventListener('DOMContentLoaded', () => {
    generateMatrixInput();
});

function generateMatrixInput() {
    const order = parseInt(document.getElementById('order').value);
    const matrixDiv = document.getElementById('matrix');
    matrixDiv.innerHTML = '';

    for (let i = 0; i < order; i++) {
        const row = document.createElement('div');
        row.classList.add('matrix-row');
        
        for (let j = 0; j < order; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `a${i}${j}`;
            input.placeholder = `a${i + 1}${j + 1}`;
            row.appendChild(input);
        }

        const bInput = document.createElement('input');
        bInput.type = 'number';
        bInput.id = `b${i}`;
        bInput.placeholder = `b${i + 1}`;
        row.appendChild(bInput);
        matrixDiv.appendChild(row);
    }

    const solutionsDiv = document.getElementById('solutions');
    solutionsDiv.innerHTML = '';
    
    for (let i = 0; i < order; i++) {
        const solutionP = document.createElement('p');
        solutionP.id = `x${i + 1}-gauss`;
        solutionsDiv.appendChild(solutionP);

        const solutionPJordan = document.createElement('p');
        solutionPJordan.id = `x${i + 1}-gauss-jordan`;
        solutionsDiv.appendChild(solutionPJordan);
    }
}

function compute(method) { 
    const order = parseInt(document.getElementById('order').value);
    const matrix = [];
    const results = [];

    for (let i = 0; i < order; i++) {
        const row = [];
        for (let j = 0; j < order; j++) {
            row.push(parseFloat(document.getElementById(`a${i}${j}`).value));
        }
        matrix.push(row);
        results.push(parseFloat(document.getElementById(`b${i}`).value));
    }

    if (method === 'gauss') {
        gaussElimination(matrix, results);
    } else if (method === 'gauss-jordan') {
        gaussJordanElimination(matrix, results);
    }
}

function gaussElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-steps');
    stepsDiv.innerHTML = '';

    const order = matrix.length;
    for (let k = 0; k < order; k++) {
        for (let i = k + 1; i < order; i++) {
            let factor = matrix[i][k] / matrix[k][k];
            factor = Math.round(factor * 100) / 100; // Membulatkan faktor ke 2 desimal
            for (let j = k; j < order; j++) {
                matrix[i][j] -= factor * matrix[k][j];
            }
            results[i] -= factor * results[k];
            displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor})R${k + 1}`, Math.round(matrix[k][k]), false);
        }
    }

    const solution = backSubstitution(matrix, results);
    displaySolution(solution, 'gauss');
}

function gaussJordanElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-jordan-steps');
    stepsDiv.innerHTML = '';

    const order = matrix.length;
    for (let k = 0; k < order; k++) {
        let pivot = matrix[k][k];
        for (let j = k; j < order; j++) {
            matrix[k][j] /= pivot;
        }
        results[k] /= pivot;
        pivot = Math.round(pivot * 100) / 100; // Membulatkan pivot ke 2 desimal
        displayStep(matrix, results, stepsDiv, `R${k + 1} -> R${k + 1} / (${pivot})`, pivot, true);

        for (let i = 0; i < order; i++) {
            if (i !== k) {
                let factor = matrix[i][k];
                factor = Math.round(factor * 100) / 100; // Membulatkan faktor ke 2 desimal
                for (let j = k; j < order; j++) {
                    matrix[i][j] -= factor * matrix[k][j];
                }
                results[i] -= factor * results[k];
                displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor})R${k + 1}`, pivot, true);
            }
        }
    }

    const solution = results.map(x => Math.round(x * 100) / 100); // Membulatkan solusi akhir ke 2 desimal
    displaySolution(solution, 'gauss-jordan');
}

function backSubstitution(matrix, results) {
    const order = matrix.length;
    const solution = Array(order).fill(0);

    for (let i = order - 1; i >= 0; i--) {
        let sum = results[i];
        for (let j = i + 1; j < order; j++) {
            sum -= matrix[i][j] * solution[j];
        }
        solution[i] = Math.round((sum / matrix[i][i]) * 100) / 100; // Membulatkan ke 2 desimal
    }

    return solution;
}

function displaySolution(solution, method) {
    for (let i = 0; i < solution.length; i++) {
        document.getElementById(`x${i + 1}-${method}`).innerText = `x${i + 1} = ${solution[i]}`;
    }
}

function displayStep(matrix, results, stepsDiv, operation, pivot, isGaussJordan) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');

    const operationP = document.createElement('p');
    operationP.classList.add('operation');
    operationP.innerText = `${operation} (Pivot: ${pivot})`;
    stepDiv.appendChild(operationP);

    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            if (isGaussJordan && j < i) {
                cell.innerText = 0; // Mengatur elemen bawah diagonal utama menjadi 0
            } else {
                cell.innerText = Math.round(matrix[i][j] * 100) / 100; // Membulatkan ke 2 desimal
            }
            row.appendChild(cell);
        }
        const resultCell = document.createElement('td');
        resultCell.innerText = Math.round(results[i] * 100) / 100; // Membulatkan ke 2 desimal
        row.appendChild(resultCell);
        table.appendChild(row);
    }

    stepDiv.appendChild(table);
    stepsDiv.appendChild(stepDiv);
}
