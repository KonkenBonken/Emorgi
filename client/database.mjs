import Emoji from './emoji.mjs';

const datasetRaw = await fetch('../dataset.csv');
const dataset = new Map();

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const fromB64 = x => x.split("").reduce((s, v) => s = s * 64 + digit.indexOf(v), 0);

datasetRaw.split(';').forEach(line => {
	const [unicode, name, img] = line.split(',');
	// unicode -> num -> b64
	// name -> % = " face " -> + = " with "
	// img -> b64 image -> add "data:image/png;base64,"

	unicode = unicode.split(' ').map(x => fromB64(x).toString(16));
	name = name.replace('%', ' face ').replace('+', ' with ').trim();
	img = "data:image/png;base64," + img;

	dataset.set(unicode, new Emoji(unicode, name, img))
});


module.exports = { dataset, datasetRaw };