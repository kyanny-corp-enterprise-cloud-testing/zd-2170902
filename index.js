const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function extractLinesBetweenDelimiters(filename) {
  const data = fs.readFileSync(filename, 'utf8');
  const lines = data.split('\n');
  let result = [];
  let isBetweenDelimiters = false;

  for (const line of lines) {
    if (line.trim() === '---') {
      if (isBetweenDelimiters) {
        // Found the ending delimiter, stop extracting lines
        break;
      } else {
        // Found the starting delimiter, start extracting lines
        isBetweenDelimiters = true;
      }
    } else if (isBetweenDelimiters) {
      result.push(line);
    }
  }

  return result;
}

function getFilenameWithoutExtension(filePath) {
  const filename = path.basename(filePath);
  const filenameWithoutExtension = path.parse(filename).name;
  return filenameWithoutExtension;
}

const directoryPath = './wiki-index.wiki';

let wikiIndex = "";
let markdownIndex = "";

try {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const filename = path.basename(filePath);
    const filenameWithoutExtension = getFilenameWithoutExtension(filePath);
    
    try {
      const data = fs.readFileSync(filePath, 'utf8');

      const extractedLines = extractLinesBetweenDelimiters(filePath);
      const yamlData = extractedLines.join('\n');

      try {
        // Parse YAML into JavaScript object
        const parsedData = yaml.load(yamlData);

        // Access and use the parsed data
        //console.log(parsedData);

        wikiIndex += `- [[${filenameWithoutExtension}]]\n`;
        markdownIndex += `- [${filenameWithoutExtension}](./${filename})\n`;

        console.log(parsedData);
        if (!!parsedData["keywords"]) {
          console.log(filename);

          wikiIndex += "  - keywords: "
          wikiIndex += parsedData["keywords"].join(", ");
          wikiIndex += "\n";
 
          markdownIndex += "  - keywords: "
          markdownIndex += parsedData["keywords"].join(", ");
          markdownIndex += "\n";
          
        }
      } catch (error) {
        console.error('Error parsing YAML file:', error);
      }

      console.log(`File: ${file}`);
//      console.log('Content:', data);
      console.log('-------------------------');
    } catch (err) {
      console.error('Error reading file:', err);
    }
  });
} catch (err) {
  console.error('Error reading directory:', err);
}

console.log(wikiIndex);
console.log(markdownIndex);

try {
  fs.writeFileSync('wiki-index.md', markdownIndex);
  console.log('The file has been saved!');
} catch (err) {
  console.error('An error occurred while writing the file:', err);
}
