const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist/bundle.css');

const isCSSFile = (file) => path.extname(file) === '.css';

const readStyles = () => {
    const styles = [];

    const files = fs.readdirSync(stylesPath);

    files.forEach((file) => {
        const filePath = path.join(stylesPath, file);

        if (fs.statSync(filePath).isFile() && isCSSFile(file)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            styles.push(content);
        }
    });

    return styles.join('\n');
};

const writeBundle = (content) => {
    fs.writeFileSync(distPath, content);
    console.log('Bundle created successfully at', distPath);
};

const main = () => {
    const stylesContent = readStyles();
    writeBundle(stylesContent);
};

main();
