const fs = require('fs').promises;
const path = require('path');

// Задача 04: Копирование директории
async function copyDir() {
    try {
        const sourcePath = path.join(__dirname, 'assets');
        const projectDistPath = path.join(__dirname, 'project-dist');
        const destinationPath = path.join(projectDistPath, 'assets');

        await fs.mkdir(projectDistPath, {recursive: true});

        await fs.mkdir(destinationPath, {recursive: true});

        await copyDirRecursive(sourcePath, destinationPath);
        console.log('Директория скопирована успешно в project-dist.');
    } catch (error) {
        console.error('Ошибка при копировании директории:', error.message);
    }
}

async function copyDirRecursive(source, destination) {
    try {
        await fs.mkdir(destination, {recursive: true});
        const files = await fs.readdir(source);

        const destinationFiles = await fs.readdir(destination);
        for (const file of destinationFiles) {
            if (!files.includes(file)) {
                const filePath = path.join(destination, file);
                await fs.unlink(filePath);
            }
        }

        for (const file of files) {
            const sourceFile = path.join(source, file);
            const destinationFile = path.join(destination, file);
            const stats = await fs.stat(sourceFile);
            if (stats.isDirectory()) {
                // Если это директория, рекурсивно копируем её
                await copyDirRecursive(sourceFile, destinationFile);
            } else { // Иначе, копируем файл
                await fs.copyFile(sourceFile, destinationFile);
            }
        }
    } catch (error) {
        console.error('Ошибка при копировании директории:', error.message);
    }
}

async function mergeStyles() {
    try {
        const stylesPath = path.join(__dirname, 'styles');
        const outputPath = path.join(__dirname, 'style.css');

        const styleFiles = await fs.readdir(stylesPath);
        const compiledStyles = styleFiles.map(file => {
            const filePath = path.join(stylesPath, file);
            return fs.readFile(filePath, 'utf-8');
        });

        const mergedStyleContent = (await Promise.all(compiledStyles)).join('\n');

        await fs.writeFile(outputPath, mergedStyleContent);

        console.log('Стили объединены успешно.');
    } catch (error) {
        console.error('Ошибка при объединении стилей:', error.message);
    }
}

async function buildPage() {
    try {
        const projectDistPath = path.join(__dirname, 'project-dist');
        const templatePath = path.join(__dirname, 'template.html');
        const componentsPath = path.join(__dirname, 'components');
        const stylesPath = path.join(__dirname, 'styles');

        await fs.mkdir(projectDistPath, {recursive: true});

        const templateContent = await fs.readFile(templatePath, 'utf-8');

        const tagNames = templateContent.match(/{{([^}]+)}}/g).map(match => match.slice(2, -2));

        let modifiedTemplate = templateContent;
        for (const tagName of tagNames) {
            const componentFilePath = path.join(componentsPath, `${tagName}.html`);
            const componentContent = await fs.readFile(componentFilePath, 'utf-8');
            modifiedTemplate = modifiedTemplate.replace(`{{${tagName}}}`, componentContent);
        }

        const indexPath = path.join(projectDistPath, 'index.html');
        await fs.writeFile(indexPath, modifiedTemplate);

        const styleFiles = await fs.readdir(stylesPath);
        const compiledStyles = styleFiles.map(file => {
            const filePath = path.join(stylesPath, file);
            return fs.readFile(filePath, 'utf-8');
        });

        const compiledStyleContent = (await Promise.all(compiledStyles)).join('\n');
        const stylePath = path.join(projectDistPath, 'style.css');
        await fs.writeFile(stylePath, compiledStyleContent);

        console.log('Страница успешно построена.');
    } catch (error) {
        console.error('Ошибка при построении страницы:', error.message);
    }
}

(async () => {
    await copyDir();
    await mergeStyles();
    await buildPage();
})();
