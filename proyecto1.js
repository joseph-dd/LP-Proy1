const fs = require('fs');

function esDigito(caracter) {
  return /[0-9.]/.test(caracter);
}

function esLetra(caracter) {
  return /[a-zA-Z]/.test(caracter);
}

function analizadorLexico(expresion) {
  let tokens = [];
  let i = 0;
  let erroresLexicos = 0;

  while (i < expresion.length) {
    if (esDigito(expresion[i])) {
      let numero = '';
      while (i < expresion.length && esDigito(expresion[i])) {
        numero += expresion[i];
        i++;
      }
      if (numero[0] === '.' || numero[numero.length - 1] === '.') {
        tokens.push({ tipo: 'NUMERO', valor: '--' });
        erroresLexicos++;
        i++;
      } else {
        tokens.push({ tipo: 'NUMERO', valor: numero });
      }
    } else if (esLetra(expresion[i])) {
      let variable = '';
      while (i < expresion.length && esLetra(expresion[i])) {
        variable += expresion[i];
        i++;
      }
      if (
        variable === 'sen' ||
        variable === 'cos' ||
        variable === 'tan' ||
        variable === 'sqrt' ||
        variable === 'ln' ||
        variable === 'f' ||
        variable === 'arcsen' ||
        variable === 'arccos' ||
        variable === 'arctan'
      ) {
        tokens.push({ tipo: 'FUNCION', valor: variable });
      } else {
        tokens.push({ tipo: 'VARIABLE', valor: variable });
      }
    } else if (
      expresion[i] === '+' ||
      expresion[i] === '*' ||
      expresion[i] === '/' ||
      expresion[i] === '(' ||
      expresion[i] === ')' ||
      expresion[i] === '^' ||
      expresion[i] === '=' ||
      expresion[i] === ' ' ||
      expresion[i] === '\n'
    ) {
      if (expresion[i] !== ' ' && expresion[i] !== '\n') {
        tokens.push({ tipo: 'OPERADOR', valor: expresion[i] });
      }
      i++;
    } else if (expresion[i] === '-') {
      if (i + 1 < expresion.length && esDigito(expresion[i + 1])) {
        let numeroNegativo = '-';
        i++;
        while (i < expresion.length && esDigito(expresion[i])) {
          numeroNegativo += expresion[i];
          i++;
        }
        if (
          numeroNegativo[0] === '.' ||
          numeroNegativo[numeroNegativo.length - 1] === '.'
        ) {
          tokens.push({ tipo: 'NUMERO', valor: '--' });
          erroresLexicos++;
          i++;
        } else {
          tokens.push({ tipo: 'NUMERO', valor: numeroNegativo });
        }
      } else {
        tokens.push({ tipo: 'OPERADOR', valor: '-' });
        i++;
      }
    } else {
      erroresLexicos++;
      i++;
    }
  }

  return { tokens, erroresLexicos };
}
function analizadorSintactico(tokens) {
  let i = 0;
  let erroresSintacticos = 0;

  function expresion() {
    if (i < tokens.length) {
      termino();
      while (i < tokens.length && (tokens[i].valor === '+' || tokens[i].valor === '-' || tokens[i].valor === '=' )) {
        i++;
        if (i < tokens.length) {
          termino();
        } else {
          erroresSintacticos++;
        }
      }
    } else {
      erroresSintacticos++;
    }
  }

  function termino() {
    if (i < tokens.length) {
      factor();
      while (i < tokens.length && (tokens[i].valor === '*' || tokens[i].valor === '/' || tokens[i].valor === '^')) {
        i++;
        if (i < tokens.length) {
          factor();
        } else {
          erroresSintacticos++;
        }
      }
    } else {
      erroresSintacticos++;
    }
  }

  function factor() {
    if (i < tokens.length && tokens[i].valor === '-') {
      i++;
    }
    if (i < tokens.length && (tokens[i].tipo === 'NUMERO' || tokens[i].tipo === 'VARIABLE')) {
      i++;
    } else if (i < tokens.length && tokens[i].tipo === 'FUNCION') {
      if (i + 1 < tokens.length && tokens[i + 1].valor === '(') {
        i += 2;
        expresion();
        if (i < tokens.length && tokens[i].valor === ')') {
          i++;
        } else {
          erroresSintacticos++;
        }
      } else {
        erroresSintacticos++;
      }
    }else if (i < tokens.length && tokens[i].valor === '(') {
      i++;
      expresion();
      if (i < tokens.length && tokens[i].valor === ')') {
        i++;
      } else {
        erroresSintacticos++;
      }
    } else {
      erroresSintacticos++;
    }
  }

  expresion();

  if (i !== tokens.length) {
    erroresSintacticos++;
  }
  return erroresSintacticos;
}

const lineas = fs.readFileSync('entrada.txt', 'utf8').trim().split('\n');

fs.writeFileSync('salida.txt', '');

for (let i = 0; i < lineas.length; i++) {
  const expresion = lineas[i].trim();
  const { tokens, erroresLexicos } = analizadorLexico(expresion);
  const erroresSintacticos = analizadorSintactico(tokens);

  const totalErrores = erroresLexicos + erroresSintacticos;

  if (totalErrores === 0) {
    fs.appendFileSync('salida.txt', `LINEA ${i + 1}: SINTAXIS OK.\n`);
  } else {
    fs.appendFileSync('salida.txt', `LINEA ${i + 1}: ${totalErrores} error(es) en la expresión.\n`);
  }
}
