console.log('Emoji.mjs running');

const newDiv = (el = 'div', ...classes) => {
		let div = document.createElement(el);
		if (classes) classes.forEach(cl => div.classList.add(cl));
		div.Src = str => { div.src = str; return div };
		div.Append = (...el) => { if (el[0]) div.append(...el); return div };
		div.On = function (a, b) { div.addEventListener(b ? a : 'click', b || a); return div };
		div.Attribute = (key, value = '', ignIfEpty = false) => { if (!ignIfEpty || value) div.setAttribute(key, value); return div };
		div.ToggleAttribute = (key, force) => { div.toggleAttribute(key, force); return div };
		div.Title = str => { div.title = str; return div.Attribute('title', str) };
		return div;
	},
	space = document.querySelector('space'),
	emojilist = document.querySelector('emojilist'),
	allEmojis = () => Array.from(space.querySelectorAll('.emoji'));

const onMouseUp = fun => document.addEventListener('mouseup', fun, { once: true });

export class Emoji {
	constructor(unicode, name, imgSrc) {
		this.unicode = unicode;
		this.name = name;
		this.imgSrc = imgSrc;
	}

	get key() {
		return this.unicode.sort().join(' ')
	}
	newElement() {
		return newDiv('div', 'emoji')
			.Title(this.name)
			.Append(
				newDiv('img')
				.Src(this.imgSrc)
				.Attribute('draggable', false)
			);

	}

	draggableElement(x = 0, y = 0, spawnEvent) {
		const div = this.newElement();
		div.Emoji = this;

		div.style.left = x + 'px';
		div.style.top = y + 'px';

		const mouseOffset = {
				x: x,
				y: y
			},

			onMove = e => {
				div.style.left = e.x - mouseOffset.x + 'px';
				div.style.top = e.y - mouseOffset.y + 'px';
			},
			onClick = e => {
				if (e.button !== 0) return;
				let { left, top } = div.getBoundingClientRect();

				mouseOffset.x = e.x - left;
				mouseOffset.y = e.y - top;

				document.addEventListener('mousemove', onMove);
				div.ToggleAttribute('hover', true);

				onMouseUp(() => {
					document.removeEventListener('mousemove', onMove)
					div.ToggleAttribute('hover', false);				})
			};

		if (spawnEvent)
			setTimeout(() => onClick(spawnEvent))
		div.On('mousedown', onClick);
		return div;
	}
	listElement() {
		const div = this.newElement();

		div.On('mousedown', e => {
			if (e.button !== 0) return;
			let { left, top } = div.getBoundingClientRect();
			this.spawn(left, top, e)
		});

		return div;
	}

	spawn(x = 0, y = 0, spawnEvent) {
		const div = this.draggableElement(x, y, spawnEvent)
		space.append(div);
		return div;
	}
}