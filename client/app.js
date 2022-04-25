console.log('App.js running');

// import { dataset } from './database.mjs';
const { dataset, Emoji } = await import('./database.mjs'),
	space = document.querySelector('space'),
	emojilist = document.querySelector('emojilist');
window.dataset = dataset;
let i = 0;
dataset.forEach(emoji => {
	if (i++ < 50) {
		if (emoji.unicode.length == 1)
			emojilist.append(emoji.listElement())
		else console.log(emoji)
	}
});