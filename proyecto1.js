const fs = require('fs');

function esDigito(caracter) {
  return /[0-9]/.test(caracter);
}

function analizadorLexico(expresion) {
  let tokens = [];
  let i = 0;

  while (i < expresion.length) {
    if (esDigito(expresion[i])) {
      let numero = '';
      while (i < expresion.length && esDigito(expresion[i])) {
        numero += expresion[i];
        i++;
      }
      tokens.push({ tipo: 'NUMERO', valor: numero });
    } else if (expresion[i] === '+' || expresion[i] === '-' || expresion[i] === '*' || expresion[i] === '/' || expresion[i] === '(' || expresion[i] === ')' || expresion[i] === ' ' || expresion[i] === '\n') {
      // Agregar el salto de línea como caracter válido
      if (expresion[i] !== ' ' && expresion[i] !== '\n') {
        // Ignorar el espacio y el salto de línea
        tokens.push({ tipo: 'OPERADOR', valor: expresion[i] });
      }
      i++;
    } else {
      throw new Error('Caracter no reconocido: ' + expresion[i]);
    }
  }

  return tokens;
}

function analizadorSintactico(tokens) {
  let i = 0;

  function expresion() {
    let termino1 = termino();
    while (i < tokens.length && (tokens[i].valor === '+' || tokens[i].valor === '-')) {
      i++;
      let termino2 = termino();
    }
  }

  function termino() {
    let factor1 = factor();
    while (i < tokens.length && (tokens[i].valor === '*' || tokens[i].valor === '/')) {
      i++;
      let factor2 = factor();
    }
  }

  function factor() {
    if (tokens[i].tipo === 'NUMERO') {
      i++;
    } else if (tokens[i].valor === '(') {
      i++;
      expresion();
      if (tokens[i].valor === ')') {
        i++;
      } else {
        throw new Error('Error de sintaxis. Falta paréntesis de cierre.');
      }
    } else {
      throw new Error('Error de sintaxis. Se esperaba un número o paréntesis de apertura.');
    }
  }

  expresion();

  if (i !== tokens.length) {
    throw new Error('Error de sintaxis. Expresión incompleta.');
  }
}
// Leer archivo de entrada línea por línea
const lineas = fs.readFileSync('entrada.txt', 'utf8').trim().split('\n');

// Limpiar el archivo de salida antes de escribir en él
fs.writeFileSync('salida.txt', '');

// Analizar cada expresión
for (let i = 0; i < lineas.length; i++) {
  const expresion = lineas[i].trim(); // Eliminar el salto de línea
  const tokens = analizadorLexico(expresion);

  try {
    analizadorSintactico(tokens);

    // La expresión es válida
    fs.appendFileSync('salida.txt', `La expresión ${i + 1} es válida.\n`);
  } catch (error) {
    // La expresión es inválida
    fs.appendFileSync('salida.txt', `Error en la expresión ${i + 1}: ${error.message}\n`);
  }
}
