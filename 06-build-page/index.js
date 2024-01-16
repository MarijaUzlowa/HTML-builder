const fs = require('fs').promises;
const path = require('path');
const ncp = require('ncp').ncp;

const sourceDir = '06-build-page';
const distDir = path.join(__dirname, 'project-dist');

async function readTemplate() {
    const templatePath = path.join(sourceDir, 'template.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return templateContent;
}

async function replaceTags(template, components) {
    let result = template;

    for (const componentName in components) {
        const componentPath = components[componentName];
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        const tag = new RegExp(`{{${componentName}}}`, 'g');
        result = result.replace(tag, componentContent);
    }

    return result;
}

async function collectComponents() {
    const componentsDir = path.join(sourceDir, 'components');
    const componentFiles = await fs.readdir(componentsDir);

    const components = {};
    for (const file of componentFiles) {
        const componentName = path.parse(file).name;
        const componentPath = path.join(componentsDir, file);
        components[componentName] = componentPath;
    }

    return components;
}

async function readStyles() {
    const stylesPath = path.join(sourceDir, 'styles');
    const files = await fs.readdir(stylesPath);
    const cssFiles = files.filter(file => path.extname(file) === '.css');
    const styles = [];

    for (const file of cssFiles) {
        const filePath = path.join(stylesPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        styles.push(content);
    }

    return styles.join('\n');
}

async function mergeStyles() {
    const stylesContent = await readStyles();
    const stylesPath = path.join(distDir, 'style.css');

    await fs.writeFile(stylesPath, stylesContent);
    console.log('Стили объединены');
}

async function buildHTML() {
    const template = await readTemplate();
    const components = await collectComponents();

    const replacedHTML = await replaceTags(template, components);
    const indexPath = path.join(distDir, 'index.html');
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(indexPath, replacedHTML);

    console.log('Сборка HTML завершена');
}

async function copyAssets() {
    const assetsSource = path.join(sourceDir, 'assets');
    const assetsDest = path.join(distDir, 'assets');
    try {
        await fs.mkdir(assetsDest, { recursive: true });
        ncp(assetsSource, assetsDest, function (err) {
            if (err) {
                return console.error('Ошибка при копировании assets:', err);
            }
            console.log('Assets скопированы');
        });
    } catch (err) {
        console.error('Ошибка при создании каталога:', err);
    }
}

async function main() {
    await buildHTML();
    await mergeStyles();
    await copyAssets();
}

(async () => {
    await main();
})();