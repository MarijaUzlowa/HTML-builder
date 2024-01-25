const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'printed_text.txt');

const outputStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Введите текст (для выхода введите "exit"):');

const readline = require('readline');
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

r1.prompt();

r1.on('line', (input) => {
    const trimmedInput = input.trim();
    if (trimmedInput.toLowerCase() === 'exit') {
        r1.close();
    } else {
        outputStream.write(trimmedInput + '\n');
        r1.prompt();
    }

});

r1.on('close', () => {
    console.log('Завершена запись текста');
    process.exit(0);
});

process.on('SIGINT', () => {
    r1.close();
});
