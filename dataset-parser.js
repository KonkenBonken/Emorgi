const fs = require('fs').promises;
const csv = require('csvtojson');
const lcs = require('common-substrings');

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const toB64 = x => x.toString(2).split(/(?=(?:.{6})+(?!.))/g).map(v => digit[parseInt(v, 2)]).join("");


// fs.readFile('dataset.raw.csv').then(async dataset => {
// 	dataset = dataset.toString();
//
// 	dataset = dataset.split('\n').slice(1, -1).map(line => {
// 		[n, emoji, unicode, name, , , , , , , , , , , , img] = line.split(',')
csv().fromFile('dataset.raw.csv').then(async dataset => {
	dataset = dataset.map(line => {

		let { unicode, name, JoyPixels: img } = line

		img = img.substr(56).replace(/=*"$/, '')

		unicode = unicode.split(' ').map(x =>
			toB64(parseInt(x.substr(2), 16))
		).join(' ');

		names1.push(name);

		[
			['face', '%'],
			['with', '+'],
			['flag', '@'],
			['woman', '£'],
			['button', '$'],
			['person', '¤'],
			['family', '€'],
			['man', '='],
			['ing', '?'],
		].forEach(([word, char]) =>
			name = name
			.replace(/^⊛*\s*/, '')
			.replace(new RegExp(word, 'g'), char));

		return [unicode, name, img].join(',');
		// unicode -> num -> b64
		// name -> char = " word "
		// img -> b64 image -> add "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICA"
	}).join(';');
	fs.writeFile('dataset.csv', dataset);
});