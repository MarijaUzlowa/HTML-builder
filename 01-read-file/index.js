const path = require('path');
const fs  = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (chunk) => {
    console.log(chunk);
});

readStream.on('end', () => {
    console.log('Чтение файла text.txt завершено');
});

readStream.on('error', (error) => {
    console.error(`Ошибка при чтении файла text.txt: ${error.message}`);
});
