import VolumeOn from '../../assets/audio/volume-on.wav';
import VolumeLowImage from '../../assets/icons/volume-low.svg';
import VolumeOffImage from '../../assets/icons/volume-mute.svg';
import VolumeMediumImage from '../../assets/icons/volume-medium.svg';
import VolumeHighImage from '../../assets/icons/volume-high.svg';
import LocalStorageUtil from '../../util/LocalStorageUtil';
import GameAudio from '../GameAudio';

export default class AudioButton {
	private button: HTMLElement = document.getElementById('ui-audio-button') as HTMLButtonElement;
	private buttonImage: HTMLImageElement = document.getElementById(
		'ui-audio-button-image'
	) as HTMLImageElement;
	private audio: GameAudio;
	private static sound: HTMLAudioElement = new Audio(VolumeOn);

	constructor(audio: GameAudio) {
		this.audio = audio;
		this.onClick = this.onClick.bind(this);
		this.start();
	}

	public start(): void {
		this.setAudioButtonImage(LocalStorageUtil.initVolumeIndex());
		this.button.addEventListener('click', this.onClick);
	}

	private onClick(): void {
		const newVolumeIndex: number = (this.audio.volumeIndex + 1) % GameAudio.volumeRange.length;

		this.audio.volumeIndex = newVolumeIndex;
		AudioButton.sound.volume =
			GameAudio.volumeRange[newVolumeIndex] + (newVolumeIndex === 0 ? 0 : 0.35);
		LocalStorageUtil.setVolumeIndex(newVolumeIndex);
		this.audio.playSoundOverlap(AudioButton.sound);
	}

	public stop(): void {
		this.button.removeEventListener('click', this.onClick);
	}

	public hide(): void {
		this.button.style.display = 'none';
	}

	public show(): void {
		this.button.style.display = 'block';
	}

	public setAudioButtonImage(volumeIndex: number): void {
		switch (volumeIndex) {
			case 0: {
				this.buttonImage.src = VolumeOffImage;
				break;
			}
			case 1: {
				this.buttonImage.src = VolumeLowImage;
				break;
			}
			case 2: {
				this.buttonImage.src = VolumeMediumImage;
				break;
			}
			case 3: {
				this.buttonImage.src = VolumeHighImage;
				break;
			}
		}
	}
}
