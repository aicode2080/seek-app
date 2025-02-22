#!/usr/bin/env node
 
const program = require('commander');
const fs = require('fs');
const path = require('path');
 
program
  .version('0.0.1')
  .description('My custom scaffolding tool')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --directory <directory>', 'Target directory', './')
  .parse(process.argv);
 
const projectName = program.opts().name;
const targetDir = program.opts().directory;
const projectPath = path.join(targetDir, projectName);
 
if (!projectName) {
  console.error('Error: Please specify a project name using --name or -n');
  process.exit(1);
}
 
function createProject() {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
    console.log(`Created project directory at ${projectPath}`);
  } else {
    console.log(`Directory ${projectPath} already exists`);
  }
}
 
function addFiles() {
  const files = [
    { name: 'index.js', content: 'console.log("Hello World!")' },
    { name: 'README.md', content: '# ' + projectName },
    { name: 'package.json', content: JSON.stringify({ name: projectName, version: "1.0.0" }, null, 2) }
  ];
 
  files.forEach(file => {
    const filePath = path.join(projectPath, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`Created ${file.name}`);
  });
}
 
createProject();
addFiles();