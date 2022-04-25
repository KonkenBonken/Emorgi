console.log('Emoji.mjs running');

const newDiv = (el = 'div', ...classes) => {
		let div = document.createElement(el);
		if (classes) classes.forEach(cl => div.classList.add(cl));
		div.Html = str => { div.innerHTML = str; return div };
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
		this.discovered = false;
	}

	static mergeKeys(...keys) {
		return keys.flatMap(x => x.split(' ')).sort().join(' ');
	}

	get key() {
		return this.unicode.sort().join(' ')
	}

	get components() {
		return this.unicode.map(code => window.dataset.get(code))
	}

	discover(show = true) {
		if (this.discovered) return;
		this.discovered = true;
		if (!show) return;
		let div = newDiv('div', 'discovered')
			.Append(
				this.newElement()
				.Append(newDiv('h3').Html(this.name))
			);
		space.append(div);
		setTimeout(() => div.remove(), 3000);
	}

	spawnComponents() {
		return this.components.map(x => x.spawn())
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
					div.ToggleAttribute('hover', false);
					let intersect = div.intersect();
					if (intersect)
						console.log(div.merge(intersect), 1);
				})
			};

		if (spawnEvent)
			setTimeout(() => onClick(spawnEvent))
		div.On('mousedown', onClick);

		div.intersect = () => {
			const rect = div.getBoundingClientRect();
			return allEmojis().find(emoji => {
				const { left, top, bottom, right } = emoji.getBoundingClientRect();
				return div !== emoji && (rect.top + rect.height > top &&
					rect.left + rect.width > left &&
					rect.bottom - rect.height < bottom &&
					rect.right - rect.width < right);
			})
		};

		div.merge = element => {
			if (!(element && element.classList.contains('emoji') && window.dataset && element.Emoji)) return console.log([element, window.dataset]);
			const key = Emoji.mergeKeys(this.key, element.Emoji.key);
			console.log(key, window.dataset.has(key));
			if (!window.dataset.has(key)) return;

			const { left, top } = element.getBoundingClientRect(),
				emoji = window.dataset.get(key);
			console.log(emoji);
			div.remove();
			element.remove();
			return emoji.spawn(left, top);
		};

		return div;
	}
	listElement() {
		const div = this.newElement();

		div.On('mousedown', e => {
			if (e.button !== 0) return;
			let { left, top } = div.getBoundingClientRect();
			this.spawn(left, top, e)
		});

		this.discover(false);
		return div;
	}

	spawn(x = 0, y = 0, spawnEvent) {
		const div = this.draggableElement(x, y, spawnEvent)
		space.append(div);
		this.discover();
		return div;
	}
}