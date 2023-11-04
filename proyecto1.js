const fs = require('fs');

function esDigito(caracter) {
  return /[0-9]/.test(caracter);
}

function esLetra(caracter) {
  return /[a-zA-Z]/.test(caracter);
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
    } else if (esLetra(expresion[i])) {
      let variable = '';
      while (i < expresion.length && esLetra(expresion[i])) {
        variable += expresion[i];
        i++;
      }
      if (variable === 'sqrt' || variable === 'e' || variable === 'ln' || variable === 'sen' || variable === 'cos' || variable === 'tan' || variable === 'arcsen' || variable === 'arccos' || variable === 'arctan'){
        tokens.push({ tipo: 'FUNCION', valor: variable });
      } else {
        tokens.push({ tipo: 'VARIABLE', valor: variable });
      }
    } else if (expresion[i] === '+' || expresion[i] === '-' || expresion[i] === '*' || expresion[i] === '/' || expresion[i] === '(' || expresion[i] === ')' || expresion[i] === '^' || expresion[i] === ' ' || expresion[i] === '\n') {
      if (expresion[i] !== ' ' && expresion[i] !== '\n') {
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
  if (tokens.length === 0) {
    throw new Error('Error de sintaxis. Expresion incompleta.');
  }

  function expresion() {
    let termino1 = termino();
    while (i < tokens.length && (tokens[i].valor === '+' || tokens[i].valor === '-')) {
      i++;
      let termino2 = termino();
    }
  }

  function termino() {
    let factor1 = factor();
    while (i < tokens.length && (tokens[i].valor === '*' || tokens[i].valor === '/' || tokens[i].valor === '^')) {
      i++;
      let factor2 = factor();
    }
  }

  function factor() {
    if (tokens[i].tipo === 'NUMERO' || tokens[i].tipo === 'VARIABLE') {
      i++;
    } else if (tokens[i].tipo === 'FUNCION') {
      // Verificar si hay un paréntesis de apertura '(' después del token de función
      if (i + 1 < tokens.length && tokens[i + 1].valor === '(') {
        i += 2; // Avanzar dos tokens para saltar el token de función y el '('
        expresion();
        // Verificar si hay un paréntesis de cierre ')' después de la expresión
        if (i < tokens.length && tokens[i].valor === ')') {
          i++; // Avanzar para saltar el ')'
        } else {
          throw new Error('Error de sintaxis. Falta paréntesis de cierre.');
        }
      } else {
        throw new Error('Error de sintaxis. Se esperaba un paréntesis de apertura.');
      }
    }else if (tokens[i].valor === '(') {
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
    fs.appendFileSync('salida.txt', `LINEA ${i + 1}: SINTAXIS OK.\n`);
  } catch (error) {
    // La expresión es inválida
    fs.appendFileSync('salida.txt', `LINEA ${i + 1}: Error en la expresión (${error.message})\n`);
  }
}
