console.log('Database.mjs running');

export const { Emoji } = await import('./emoji.mjs');

export const datasetRaw = await (await fetch('./dataset.csv')).text();
export const dataset = new Map();

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const fromB64 = x => x.split("").reduce((s, v) => s = s * 64 + digit.indexOf(v), 0);

datasetRaw.split(';').forEach(line => {
	let [unicode, name, img] = line.split(',');
	// unicode -> num -> b64
	// name -> % = " face " -> + = " with "
	// img -> b64 image -> add "data:image/png;base64,"

	unicode = unicode.split(' ').map(x => fromB64(x).toString(16));
	name = name.replace('%', ' face ').replace('+', ' with ').replace(/\s\s+/g, ' ').trim();
	img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICA" + img;

	let emoji = new Emoji(unicode, name, img);
	dataset.set(emoji.key, emoji);
});