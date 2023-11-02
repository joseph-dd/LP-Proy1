const fs = require('fs');

function analizarExpresion(expresion) {
  let pila = [];

  for (let i = 0; i < expresion.length; i++) {
    const char = expresion[i];

    if (char === '(') {
      pila.push(char);
    } else if (char === ')') {
      if (pila.length === 0 || pila.pop() !== '(') {
        return 'Parentesis sin abrir.';
      }
    }
  }

  if (pila.length > 0) {
    return 'Parentesis sin cerrar.';
  }

  const operadores = ['+', '-', '*', '/'];

  for (let i = 0; i < expresion.length; i++) {
    const char = expresion[i];

    if (operadores.includes(char)) {
      if (i === 0 || i === expresion.length - 1) {
        return 'Operador sin segundo término.';
      }

      const prevChar = expresion[i - 1];
      const nextChar = expresion[i + 1];

      if (prevChar === '(' || nextChar === ')') {
        return 'Operador sin segundo término.';
      }
    }
  }

  return null;
}

const inputFile = 'archivo.txt';

fs.readFile(inputFile, 'utf-8', (err, data) => {
  if (err) {
    console.error(`Error al leer el archivo ${inputFile}: ${err}`);
    return;
  }

  const lines = data.split('\n');

  lines.forEach((line, index) => {
    const error = analizarExpresion(line);

    if (error) {
      console.log(`LINEA ${index + 1}: ${line}\nSe ha encontrado 1 error(es): ${error}`);
    } else {
      console.log(`LINEA ${index + 1}: ${line}\nSintaxis valida sin errores`);
    }
  });
});
