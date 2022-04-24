const fs = require('fs').promises;
fs.readFile('dataset.raw.csv').then(async dataset => {
	dataset = dataset.toString();
	dataset = dataset.split('\n').slice(1, -1).map(line => {
		[n, emoji, unicode, name, , , , , , , , , , , , img] = line.split(',')
		return [unicode, name, img].join(',');
	}).join(';')
	fs.writeFile('dataset.csv', dataset)
});