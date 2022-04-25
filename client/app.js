console.log('App.js running');

const { dataset, Emoji } = await import('./database.mjs'),
	space = document.querySelector('space'),
	emojilist = document.querySelector('emojilist');
window.dataset = dataset;

let spawned = 4;
dataset.forEach(emoji => {
	if (emoji.unicode.length == 1)
		emojilist.append(emoji.listElement())
	else {
		console.log(emoji);
		if (!--spawned)
			emoji.spawnComponents()
	}

});