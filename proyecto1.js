const fs = require('fs');

const nombreArchivo = 'archivo.txt';

function analizarExpresionAritmetica(expresion) {
    try {
        // Intenta evaluar la expresión
        eval(expresion);
        console.log('Expresión válida');
    } catch (error) {
        console.error(`Error al evaluar la expresión: ${error.message}`);
    }
}

// ... Código para leer el archivo ...

// Dentro de la función de callback de fs.readFile
fs.readFile(nombreArchivo, 'utf8', (error, data) => {
    if (error) {
        console.error('Error al leer el archivo:', error);
        return;
    }

    let lineas = data.split('\n');
    for (let i = 0; i < lineas.length; i++) {
        let expresion = lineas[i].trim();
        console.log(`LINEA ${i + 1}: ${expresion}`);
        analizarExpresionAritmetica(expresion);
    }
});
