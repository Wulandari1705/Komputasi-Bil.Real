// MyKomputasi-By.Indria Wulandari
// Solusi untuk Sistem Persamaan Linear menggunakan Metode Gauss & Gauss-Jordan dengan hasil berupa Bilangan Real

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
        const { matrixAfterGauss, resultsAfterGauss, pivots } = gaussElimination(matrix, results);
        const solution = backSubstitution(matrixAfterGauss, resultsAfterGauss);
        displaySolution(solution, 'gauss');
    } else if (method === 'gauss-jordan') {
        const { matrixAfterGauss, resultsAfterGauss, pivots } = gaussElimination(matrix, results);
        gaussJordanElimination(matrixAfterGauss, resultsAfterGauss);
    }
}

function gaussElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-steps');
    stepsDiv.innerHTML = '';

    const order = matrix.length;
    const matrixCopy = matrix.map(row => [...row]); // Salin matriks untuk diproses
    const resultsCopy = [...results]; // Salin hasil untuk diproses
    const pivots = []; // Untuk menyimpan nilai pivot

    for (let k = 0; k < order; k++) {
        for (let i = k + 1; i < order; i++) {
            const factor = Math.round(matrixCopy[i][k] / matrixCopy[k][k]);
            for (let j = k; j < order; j++) {
                matrixCopy[i][j] = Math.round(matrixCopy[i][j] - factor * matrixCopy[k][j]);
            }
            resultsCopy[i] = Math.round(resultsCopy[i] - factor * resultsCopy[k]);
            displayStep(matrixCopy, resultsCopy, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor})R${k + 1}`, Math.round(matrixCopy[k][k]));
            pivots.push(matrixCopy[k][k]); // Simpan nilai pivot yang digunakan
        }
    }

    return { matrixAfterGauss: matrixCopy, resultsAfterGauss: resultsCopy, pivots: pivots };
}

function gaussJordanElimination(matrix, results) {
    const stepsDiv = document.getElementById('gauss-jordan-steps');
    stepsDiv.innerHTML = '';

    const order = matrix.length;
    for (let k = order - 1; k >= 0; k--) {
        const pivot = Math.round(matrix[k][k]);
        for (let j = k; j < order; j++) {
            matrix[k][j] = Math.round(matrix[k][j] / pivot);
        }
        results[k] = Math.round(results[k] / pivot);
        displayStep(matrix, results, stepsDiv, `R${k + 1} -> R${k + 1} / (${pivot})`, pivot);

        for (let i = 0; i < k; i++) {
            const factor = Math.round(matrix[i][k]);
            for (let j = k; j < order; j++) {
                matrix[i][j] = Math.round(matrix[i][j] - factor * matrix[k][j]);
            }
            results[i] = Math.round(results[i] - factor * results[k]);
            displayStep(matrix, results, stepsDiv, `R${i + 1} -> R${i + 1} - (${factor})R${k + 1}`, pivot);
        }
    }

    const solution = results;
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
        solution[i] = Math.round(sum / matrix[i][i]);
    }

    return solution;
}

function displaySolution(solution, method) {
    for (let i = 0; i < solution.length; i++) {
        document.getElementById(`x${i + 1}-${method}`).innerText = `x${i + 1} = ${solution[i]}`;
    }
}

function displayStep(matrix, results, stepsDiv, operation, pivot) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');

    const operationP = document.createElement('p');
    operationP.classList.add('operation');
    operationP.innerText = operation + `, pivot = ${pivot}`;
    stepDiv.appendChild(operationP);

    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.innerText = Math.round(matrix[i][j]);
            row.appendChild(cell);
        }
        const resultCell = document.createElement('td');
        resultCell.innerText = Math.round(results[i]);
        row.appendChild(resultCell);
        table.appendChild(row);
    }

    stepDiv.appendChild(table);
    stepsDiv.appendChild(stepDiv);
}

