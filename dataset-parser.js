const fs = require('fs').promises;

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const toB64 = x => x.toString(2).split(/(?=(?:.{6})+(?!.))/g).map(v => digit[parseInt(v, 2)]).join("");

fs.readFile('dataset.raw.csv').then(async dataset => {
	dataset = dataset.toString();

	let face = 0,
		wit = 0,
		per = 0,
		plus = 0,
		facewith = 0;

	dataset = dataset.split('\n').slice(1, -1).map(line => {
		[n, emoji, unicode, name, , , , , , , , , , , , img] = line.split(',')

		unicode = unicode.split(' ').map(x =>
			toB64(parseInt(x.substr(2), 16))
		).join(' ');

		if (name.includes('face')) face++;
		if (name.includes('with')) wit++;
		if (name.includes('face with')) facewith++;
		if (name.includes('%')) per++;
		if (name.includes('+')) plus++;

		name = name
			.replace(/\s*face\s*/g, '%')
			.replace(/\s*with\s*/g, '+');

		return [unicode, name, img].join(',');
		// unicode -> num -> b64
		// name -> % = " face " -> + = " with "
	}).join(';')
	fs.writeFile('dataset.csv', dataset)
});