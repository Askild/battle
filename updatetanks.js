var fse = require('fs-extra');
const path = require('path');

var originalTanksToKeep = [
    "dummy",
    "crawler",
    "crazy",
    "chicken",
    "dodge",
    "sniper",
    "kamikaze",
    "jamro"
];

var pathToTanks = 'node_modules/jsbattle/dist/public/tanks';
var tankRegex = /(.+?)\.tank\.js$/;

const dir = fse.readdirSync(pathToTanks);
const tankFileNames = dir.filter(str => tankRegex.test(str) )

console.log({tankFileNames})

const filesToMove = tankFileNames.filter(tankFileName => {
    const tankName = tankRegex.exec(tankFileName)[1];
    return !originalTanksToKeep.some(originalName => originalName === tankName);
});

console.log({filesToMove});

const timeStamp = new Date().toLocaleTimeString().replace(/\:/g, '_');
const backupFolder = path.join(pathToTanks, `backup_${timeStamp}`);

console.log({backupFolder});

filesToMove.forEach(fileToMove => {
    const source = path.join(pathToTanks, fileToMove);
    const target = path.join(backupFolder, fileToMove);
    console.log(`Moving: ${source} -> ${target}`);
    fse.moveSync(source, target);
})

// Copy new tank files
const newTanks = fse.readdirSync('new-tanks');
newTanks.forEach(newTank => {
    const source = path.join('new-tanks', newTank);
    const dest = path.join(pathToTanks, newTank);
    console.log(`Copying: ${source} -> ${dest}`)
    fse.copySync(source, dest);
})

const updatedDir = fse.readdirSync(pathToTanks);
const updatedTankFileNames = updatedDir.filter(str => tankRegex.test(str));

const updatedTankNames = updatedTankFileNames.map(tankFileName => {
    const tankName = tankRegex.exec(tankFileName)[1];
    return tankName;
});

console.log({updatedTankNames});

fse.outputJSONSync(path.join(pathToTanks, 'index.json'), updatedTankNames);
