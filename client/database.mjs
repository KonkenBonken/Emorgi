console.log('Database.mjs running');

export const { Emoji } = await import('./emoji.mjs');

export const datasetRaw = await (await fetch('./dataset.csv')).text();
export const dataset = new Map();

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const fromB64 = x => x.split("").reduce((s, v) => s = s * 64 + digit.indexOf(v), 0);

datasetRaw.split(';').forEach((line, i) => {
	if (i++ > 500) return;
	let [unicode, name, img] = line.split(',');
	// unicode -> num -> b64
	// name -> % = " face " -> + = " with "
	// img -> b64 image -> add "data:image/png;base64,"

	unicode = unicode.split(' ').map(x => fromB64(x).toString(16));
	img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICA" + img;

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
	].reverse().forEach(([word, char]) => {
		name = name.replace(new RegExp('\\' + char, 'g'), word)
	});
	name = name.replace(/\s\s+/g, ' ').trim();

	let emoji = new Emoji(unicode, name, img);
	dataset.set(emoji.key, emoji);
});

for (const emoji of dataset.values()) {
	let newUnicode = emoji.unicode.filter(code => dataset.has(code));
	if (newUnicode.join() != emoji.unicode.join()) {
		dataset.delete(emoji.key);
		emoji.unicode = newUnicode;
		dataset.set(emoji.key, emoji);
	}
}