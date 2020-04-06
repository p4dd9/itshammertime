import '../styles/config.scss';

window.onload = (): void => {
	const tag = document.createElement('h1');
	tag.innerHTML = "It's Hammer Time! (appended)";
	window.document.body.appendChild(tag);
};
