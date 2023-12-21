const { join, extname, basename } = require('path');
const processSQLFile = require('./utils/processSQL');
const generateTypeDefinition = require('./utils/generateCode');
const { readdirSync, writeFileSync, mkdirSync, existsSync } = require('fs');

// Initialize paths references from current working directory
const currentDir = process.cwd();
const sourceDir = join(currentDir, 'src');
const sqlFolderDir = join(sourceDir, 'sql');
const outputFolderDir = join(sourceDir, 'queries');

function generateQueries() {
    
    const sqlFiles = readdirSync(sqlFolderDir).filter((fileName) => fileName.endsWith('.sql'));
    
    if(!existsSync(sourceDir)) {
        return console.log('Could not find "src" folder, please add it to your project')
    }

    if(!existsSync(sqlFolderDir)) {
        return console.log('Could not find "sql" folder inside the "src" folder, please add it to your project')
    }

    if(sqlFiles.length === 0) {
        return console.log('Could not find ".sql" files inside the "./src/sql" directory, please add them to your project')
    }

    if (!readdirSync(sourceDir).includes('queries')) {
        mkdirSync(outputFolderDir);
    }

    for (const fileName of sqlFiles) {
        const filePath = join(sqlFolderDir, fileName);
        const fileData = processSQLFile(filePath);
    
        const tableName = basename(fileName, extname(fileName));
        const outputFileName = join(outputFolderDir, `${tableName}.js`);
        const typeDefinition = generateTypeDefinition(tableName, fileData);
    
        writeFileSync(outputFileName, typeDefinition, 'utf-8');
        console.log('Queries added successfully');
    }
}

generateQueries();