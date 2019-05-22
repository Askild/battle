var fse = require('fs-extra');
const path = require('path');

builtInTanksToAdd = [];

const consoleColors = {
    Reset: "\x1b[0m",
    Cyan: "\x1b[36m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Green: "\x1b[32m"
};

var SETTINGS = {}
SETTINGS.copyExampleTanks = false;
var pathToTanks = 'node_modules/jsbattle/dist/public/tanks';
var pathToExampleTanks = 'exampleTanks';
var tankRegex = /(.+?)\.tank\.js$/;

// Arguments
console.log("To apply arguments to npm use -- before the arguments")
console.log("Example : npm updatetanks -- addExampleTanks")
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    processInputArguments(val);
  });

const dir = fse.readdirSync(pathToTanks);
const tankFileNames = dir.filter(str => tankRegex.test(str) )

console.log({tankFileNames})

// Copy example Tanks
if (SETTINGS.copyExampleTanks) 
{
    const newTanks = fse.readdirSync('exampleTanks');
    builtInTanksToAdd = builtInTanksToAdd.concat(newTanks);
    newTanks.forEach(newTank => {
        const source = path.join('exampleTanks', newTank);
        const dest = path.join(pathToTanks, newTank);
        console.log(consoleColors.Cyan, `Copying: ${source} -> ${dest}`, consoleColors.Reset);
        fse.copySync(source, dest);
    }) 
}


const filesToMove = tankFileNames.filter(tankFileName => {
    const tankName = tankRegex.exec(tankFileName)[1];
    return !builtInTanksToAdd.some(originalName => originalName === tankName);
});

console.log({filesToMove});

const timeStamp = new Date().toLocaleTimeString().replace(/\:/g, '_');
const backupFolder = path.join(pathToTanks, `backup_${timeStamp}`);

console.log({backupFolder});

console.log('\n');
filesToMove.forEach(fileToMove => {
    const source = path.join(pathToTanks, fileToMove);
    const target = path.join(backupFolder, fileToMove);
    console.log(consoleColors.Magenta, `Moving: ${source} -> ${target}`, consoleColors.Reset);
    fse.moveSync(source, target);
})

// Copy new tank files
console.log('\n');
const newTanks = fse.readdirSync('new-tanks');
newTanks.forEach(newTank => {
    const source = path.join('new-tanks', newTank);
    const dest = path.join(pathToTanks, newTank);
    console.log(consoleColors.Cyan, `Copying: ${source} -> ${dest}`, consoleColors.Reset);
    fse.copySync(source, dest);
})
console.log('\n');

const updatedDir = fse.readdirSync(pathToTanks);
const updatedTankFileNames = updatedDir.filter(str => tankRegex.test(str));

const updatedTankNames = updatedTankFileNames.map(tankFileName => {
    const tankName = tankRegex.exec(tankFileName)[1];
    return tankName;
});

console.log({updatedTankNames});

fse.outputJSONSync(path.join(pathToTanks, 'index.json'), updatedTankNames);

console.log(consoleColors.Green, '\nDone!', consoleColors.Reset);

function processInputArguments(arg) 
{
    if (arg.toUpperCase() == "addExampleTanks".toUpperCase()) 
    {   
       SETTINGS.copyExampleTanks = true;
    }
}