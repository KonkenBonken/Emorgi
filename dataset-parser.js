const fs = require('fs').promises;

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const toB64 = x => x.toString(2).split(/(?=(?:.{6})+(?!.))/g).map(v => digit[parseInt(v, 2)]).join("");

fs.readFile('dataset.raw.csv').then(async dataset => {
	dataset = dataset.toString();
	dataset = dataset.split('\n').slice(1, -1).map(line => {
		[n, emoji, unicode, name, , , , , , , , , , , , img] = line.split(',')

		unicode = unicode.split(' ').map(x =>
			toB64(parseInt(x.substr(2), 16))
		).join(' ');
		return [unicode, name, img].join(',');
		// unicode -> num -> b64
	}).join(';')
	fs.writeFile('dataset.csv', dataset)
});