const datasetRaw = await fetch('../dataset.csv');
const dataset = new Map();

module.exports = { dataset, datasetRaw };