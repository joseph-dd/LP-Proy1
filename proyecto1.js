const fs = require('fs');

// Nombre del archivo que quieres leer
const nombreArchivo = 'archivo.txt';

// Leer el archivo de texto
fs.readFile(nombreArchivo, 'utf8', (error, data) => {
    if (error) {
        console.error('Error al leer el archivo:', error);
        return;
    }
    console.log('Contenido del archivo:', data);
});
