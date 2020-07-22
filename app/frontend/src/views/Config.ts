import '../styles/config.scss';
import LogoImage from '../assets/images/logo.png';
import LetterImage from '../assets/images/letter.png';

window.onload = (): void => {
	const logoImage = document.getElementById('logo') as HTMLImageElement;
	const letterImage = document.getElementById('contact-image') as HTMLImageElement;

	logoImage.src = LogoImage;
	letterImage.src = LetterImage;
};
