const fs = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist/bundle.css');

const isCSSFile = (file) => path.extname(file) === '.css';

const readStyles = async () => {
    const styles = [];

    try {
        const files = await fs.readdir(stylesPath);

        for (const file of files) {
            const filePath = path.join(stylesPath, file);

            try {
                const stat = await fs.stat(filePath);

                if (stat.isFile() && isCSSFile(file)) {
                    const content = await fs.readFile(filePath, 'utf-8');
                    styles.push(content);
                }
            } catch (error) {
                console.error('Error reading file:', filePath, error);
            }
        }
    } catch (error) {
        console.error('Error reading directory:', stylesPath, error);
    }

    return styles.join('\n');
};

const writeBundle = async (content) => {
    try {
        await fs.writeFile(distPath, content);
        console.log('Bundle created successfully at', distPath);
    } catch (error) {
        console.error('Error writing bundle file:', distPath, error);
    }
};

const main = async () => {
    try {
        const stylesContent = await readStyles();
        await writeBundle(stylesContent);
    } catch (error) {
        console.error('Error in main:', error);
    }
};

(async () => {
    await main();
})();