/* Joseph De Abreu -- Lenguajes de Programacion -- Proyecto #1: Lenguaje algebraico

<expresion> ::= <termino> { ('+' | '-' | '=') <termino> }
<termino> ::= <factor> { ('*' | '/' | '^') <factor> }
<factor> ::= ['-'] (<numero> | <variable> | <funcion> | '(' <expresion> ')' )
<numero> ::= <digito> {<digito>} ['.' {<digito>}]
<digito> ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
<variable> ::= <letra> {<letra>}
<letra> ::= 'a' | 'b' | ... | 'z' | 'A' | 'B' | ... | 'Z'
<funcion> ::= 'sen(' <expresion> ')' | 'cos(' <expresion> ')' | 'tan(' <expresion> ')' | 'sqrt(' <expresion> ')' | 'ln(' <expresion> ')' 
              | 'f(' <expresion> ')' | 'arcsen(' <expresion> ')' | 'arccos(' <expresion> ')' | 'arctan(' <expresion> ')'


*/
const fs = require('fs'); // importamos File System para la lectura y escritura de archivos

function esDigito(caracter) { // funcion para comprobar si un caracter ingresado es un numero digito
  return /[0-9.]/.test(caracter); // respuesta logica al evaluar si el caracter es un digito valido entre el rango establecido
}
function esLetra(caracter) { // funcion para comprobar si un caracter ingresado es una letra
  return /[a-zA-Z]/.test(caracter); // respuesta logica para evaluar si el caracter es una letra valida entre el rango establecido
}
function obtenerSecuencia(expresion, i, esTipoCaracter, secuencia) { // funcion para agregar digitos/letras a una cadena/numero
  // declaramos secuencia a llenar de caracteres
  while (i < expresion.length && esTipoCaracter(expresion[i])) { // comprobamos que este dentro de los limites del arreglo expresion ...
    secuencia += expresion[i]; // ... y si este dato es el tipo de caracter que buscamos añadir a la secuencia (esDigito o esLetra)
    i++; // añadimos el numero/letra a la secuencia e pasamos al siguiente datos del arreglo expresion 
  }
  return { secuencia, i }; // retornamos la secuencia completa con el iterador para proseguir con la siguiente posicion del arreglo
}
function manejarNumero(numero, tokens, erroresLexicos, i, num) { // funcion para comprobar la validez de un numero decimal
  if (numero[num] === '.' || numero[numero.length - 1] === '.') { // comprobamos si el numero tiene un punto al comienzo o al final
    tokens.push({ tipo: 'NUMERO', valor: '--' }); // si es el caso lo agregamos como un token invalido
    erroresLexicos++; // sumamos un error al conteo de errores lexicos por decimal invalido
    i++; // aumentamos el iterador para manejar la siguiente posicion del arreglo de expresion
  } else {
    tokens.push({ tipo: 'NUMERO', valor: numero }); // si es valido lo agregamos como un numero decimal valido
  }
  return { tokens, erroresLexicos, i }; // retornamos el arreglo de tokens, el contador de errores lexico y el iterador actualizados
}

// funcion de analizador lexico de operaciones algebraicas
function analizadorLexico(expresion) { // pasamos como parametro un arreglo llamado expresion que divide una linea completa caracter por caracter
  
  let tokens = []; // declaramos arreglo tokens el cual se encarga de almacenar tanto el valor como el tipo del caracter / variable a ingresar
  let i = 0; // inicializamos el iterador con el cual recorreremos el arreglo expresion
  let erroresLexicos = 0; // inicializamos el contador de errores lexicos con el que trabajaremos
  
  // bucle para comprobar caracter por caracter la validez de estos y su alamacenamiento en el arreglo tokens
  while (i < expresion.length) { // mientras nos encontremos entre los limites del arreglo expresion
    
    if (esDigito(expresion[i])) { // en el caso de que el caracter sea un digito
      let numero = '';
      let secuenciaNumero = obtenerSecuencia(expresion, i, esDigito, numero); // verificamos si el numero es mas grande y concatenamos sus digitos
      i = secuenciaNumero.i; // actualizamos el iterador
      numero = secuenciaNumero.secuencia; // asignamos el numero a la secuencia anteriormente hecha
      let resultadoNumeros = manejarNumero(numero, tokens, erroresLexicos, i, 0); // verificamos la valides del numero e insertamos al arreglo tokens
      tokens = resultadoNumeros.tokens; // actualizamos el arreglo tokens
      erroresLexicos = resultadoNumeros.erroresLexicos; // actualizamos el conteo de errores lexicos
      i = resultadoNumeros.i; // actualizamos el iterador
    
    } else if (esLetra(expresion[i])) { // en el caso de que el caracter sea una letra
      let variable = '';
      let secuenciaVariables = obtenerSecuencia(expresion, i, esLetra, variable); // verificamos si la variable contiene una o mas letras
      i = secuenciaVariables.i; // actualizamos el iterador
      variable = secuenciaVariables.secuencia; // asignamos la variable a comprobar a continuacion a la secuencia anteriormente hecha
      if ( // si esta variable conincide con las funciones anteriormente declaradas en nuestro EBNF
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
        tokens.push({ tipo: 'FUNCION', valor: variable }); // la agregamos como una funcion en nuestro arreglo de tokens
      } else {
        tokens.push({ tipo: 'VARIABLE', valor: variable }); // si no es el caso la agregamos como una simple variable
      }

    } else if ( // en el caso en el que el caracter sea un operador presente en nuestra sintaxis EBNF
      expresion[i] === '+' ||
      expresion[i] === '*' ||
      expresion[i] === '/' ||
      expresion[i] === '(' ||
      expresion[i] === ')' ||
      expresion[i] === '^' ||
      expresion[i] === '=' 
    ) { 
      tokens.push({ tipo: 'OPERADOR', valor: expresion[i] }); // si es el caso lo agregamos a nuestro arreglo tokens con el tipo operador
      i++; // aumentamos el iterador
    
    // manejamos aparte el operador menos(-) para poder validar factores negativos
    } else if (expresion[i] === '-') {
      if (i + 1 < expresion.length && esDigito(expresion[i + 1])) {
        let numeroNegativo = '-';
        i++;
        let resultadoNumeros = manejarNumero(numeroNegativo, tokens, erroresLexicos, i, 1); // verificamos la valides del numero e insertamos al arreglo tokens
        tokens = resultadoNumeros.tokens; // actualizamos el arreglo tokens
        erroresLexicos = resultadoNumeros.erroresLexicos; // actualizamos el conteo de errores lexicos
        i = resultadoNumeros.i; // actualizamos nuestro iterador
      } else { // si no es el caso de que sea un numero negativo
        tokens.push({ tipo: 'OPERADOR', valor: '-' }); // añadimos el signo menos(-) como un simple operador
        i++; // aumentamos nuestro iterador
      }
    } else if (expresion[i] === ' ' || expresion[i] === '\n'){ // si nos encontramos con un salto de linea o un espacio
      i++; // lo omitimos y aumentamos nuestro iterador
    } else { // si no es ninguno de nuestros anteriores casos  
      erroresLexicos++; // sumamos un error al conteo de errores lexicos
      i++; // aumentamos nuestro iterador para trabajar con la siguiente posicion del arreglo expresion
    }
  }
  // luego de validar todo caracter de la linea procedemos a retornar como una tupla: nuestro arreglo de tipo y valor de cada caracter validado
  return { tokens, erroresLexicos }; // ... y tambien nuestra variable de errores lexicos
}

// funcion de analizador sintactico de expresiones algebraicas
function analizadorSintactico(tokens) { // pasamos como parametro el arreglo tokens conteniendo tipo y valor de caracteres validados
  let i = 0; // inicializamos nuestro iterador para recorrrer el arreglo
  let erroresSintacticos = 0; // inicializamos nuestro contador de errores sintacticos

  function expresion() { // declaramos nuestra funcion como el axioma de nuestro EBNF (<Expresion>)
    if (i < tokens.length) { // si nos encontramos en los limites de el arreglo tokens
      termino(); // hacemos uso de la funcion termino para poder determinar el valor y validez de el caracter con el trabajamos
      while (i < tokens.length && (tokens[i].valor === '+' || tokens[i].valor === '-' || tokens[i].valor === '=' )) {
        i++; // si es el caso de que el valor a encontrarnos es uno de estos operadores (+|-|=) procedemos a aumentar nuestro iterador
        if (i < tokens.length) { // si nos encontramos en los limites del arreglo tokens
          termino(); // llamamos nuevamente a la funcion termino para determinar el valor y validez de el caracter con el que trabajamos
        } else { // si pasamos de los limites de tokens
          erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos
        }
      }
    } else { // si pasamos de los limites de tokens
      erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos
    }
  }

  function termino() { // declaramos la funcion termino derivada de nuestro axioma <expresion>
    if (i < tokens.length) { // si nos encontramos en los limites de el arreglo tokens
      factor(); // hacemos uso de la funcion factor para poder determinar el valor y validez de el caracter con el trabajamos
      while (i < tokens.length && (tokens[i].valor === '*' || tokens[i].valor === '/' || tokens[i].valor === '^')) {
        i++; // mientras el valor a encontrarnos es uno de estos operadores (*|/|=) procedemos a aumentar nuestro iterador
        if (i < tokens.length) { // si nos encontramos en los limites de el arreglo tokens
          factor(); // llamamos nuevamente a la funcion termino para determinar el valor y validez de el caracter con el que trabajamos
        } else { // si nos pasamos de los limites de el arreglo tokens
          erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos
        }
      }
    } else { // si nos pasamos de los limites de el arreglo tokens
      erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos
    }
  }
  // declaramos la funcion factor derivada de termino, siendo esta el tope de estas llamadas
  function factor() { // esta funcion es principal para determinar la validez de los valores del arreglo tokens
    if (i < tokens.length && tokens[i].valor === '-') { // tenemos esta comprobacion en caso de encontrar un menos(-) ...
      i++; // ... con el proposito del manejo de numeros negativos, aumentamos nuestro iterador
    }
    if (i < tokens.length && (tokens[i].tipo === 'NUMERO' || tokens[i].tipo === 'VARIABLE')) { // en el caso de encontrar un numero o variable
      i++; // aumentamos el iterador para pasar a la siguiente posicion
    } else if (i < tokens.length && tokens[i].tipo === 'FUNCION') { // si encontramos una funcion comprobamos lo siguiente:
      if (i + 1 < tokens.length && tokens[i + 1].valor === '(') { // si encontramos despues del nombre de la funcion su respectivo parentesis
        i += 2; // aumentamos dos veces el iterador debido a que (i) es el nombre de la funcion, (i+1) es el parentesis ... 
        expresion(); // ... e (i+2) equivale a la expresion completa (volvemos a llamar a la expresion desde el principio por el axioma ...
        // ... en el caso de encontrar una nueva expresion a encerrar entra parentesis)
        if (i < tokens.length && tokens[i].valor === ')') { // si luego de identificar y validar la expresion encontramos un parentesis de ...
          i++; // ... cierre procedemos a clasificar la funcion como sintacticamente valida y aumentamos nuestro iterador
        } else { // en el caso de no encontrar un parentesis y el nombre de una funcion lo marcamos como invalido debido a que las funciones ...
          erroresSintacticos++;  // ... en la gramatica obligatoriamente deben encerrar la expresion a aplicarle la funcion entre parentesis ...
        } // ... y con este error sumamos un error al conteo de errores sintacticos
      } else { // repitiendose el mismo error de arriba, no se colocan alguno de los dos parentesis y esto genera un error en la gramatica
        erroresSintacticos++;  // y sumamos un error al conteo de errores sintacticos
      }
    }else if (i < tokens.length && tokens[i].valor === '(') { // en caso de que encontremos un parentesis de apertura
      i++; // aumentamos nuestro iterador para comprobar el contenido de este parentesis
      expresion(); // llamamos de nuevo a expresion para determinar la validez de su contenido
      if (i < tokens.length && tokens[i].valor === ')') { // si coincidimos con un parentesis de cierre lo clasificamos como valido
        i++; // aumentamos nuestro iterador 
      } else { // en el caso de no encontrar el parentesis de cierre
        erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos
      }
    } else { // en caso de no coincidir con los anteriores casos marcamos el caracter como error de sintaxis
      erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos
    }
  }

  expresion(); // damos inicio a la verificacion del arreglo tokens llamando a la funcion de nuestro axioma

  if (i !== tokens.length) { // en el caso de que nuestro iterador no haya llegado al tope de largo del arreglo tokens
    erroresSintacticos++;  // sumamos un error al conteo de errores sintacticos por expresion incompleta
  }
  return erroresSintacticos; // retornamos el numero de errores sintacticos
}

const lineas = fs.readFileSync('entrada.txt', 'utf8').trim().split('\n'); // creamos el arreglo de cadenas
// cuyas cadenas son las lineas del archivo de entrada.txt

fs.writeFileSync('salida.txt', ''); // dejamos en blanco el archivo de salida.txt para poder sobre escribirlo 

for (let i = 0; i < lineas.length; i++) { // recorremos hasta que nuestro iterador i sea menor a los limites del arreglo lineas
  const expresion = lineas[i].trim(); // declaramos expresion como la linea en la que nos encontramos actualmente
  const { tokens, erroresLexicos } = analizadorLexico(expresion); // con la funcion analizadorLexico sacamos nuestro arreglo tokens y ...
  const erroresSintacticos = analizadorSintactico(tokens); // nuestros errores tanto lexicos como sintacticos

  const totalErrores = erroresLexicos + erroresSintacticos; // sumamos el total de errores 

  if (totalErrores === 0) { // en el caso de no haber errores imprimimos que la linea tiene una sintaxis correcta
    fs.appendFileSync('salida.txt', `LINEA ${i + 1}: SINTAXIS OK.\n`);
  } else { // en el caso de que no, se muestra la cantidad de errores lexico/sintacticos
    fs.appendFileSync('salida.txt', `LINEA ${i + 1}: ${totalErrores} error(es) en la expresión.\n`);
  }
}