// Types for the twitch extension helper.
// Reference: https://dev.twitch.tv/docs/extensions/reference#javascript-helper

// tslint:disable:interface-name
declare global {
	interface Window {
		Twitch?: {
			ext: Extension;
		};
	}
}

export interface Extension {
	onAuthorized(
		cb: (auth: {
			token: string;
			userId: string;
			clientId: string;
			channelId: string;
		}) => void
	): void;
	onContext(cb: (context: ExtensionContext, delta: [string]) => void): void;
	onError(cb: (error: string) => void): void;
	onVisibilityChanged(
		cb: (isVisible: boolean, context: ExtensionContext) => void
	): void;
	send(target: string, contentType: string, message: object | string): void;
	listen(
		event: 'broadcast' | 'global' | string,
		cb: (target: string, contentType: string, message: string) => void
	): void;
	unlisten(
		event: string,
		cb: (target: string, contentType: string, message: string) => void
	): void;
	rig: ExtensionRig;
	actions: ExtensionActions;
	configuration: ExtensionConfiguration;
}

export interface ExtensionContext {
	arePlayerControlsVisible: boolean;
	bitrate: number;
	bufferSize: number;
	displayResolution: string;
	game: string;
	hlsLatencyBroadcaster: number;
	hostingInfo: {
		hostedChannelId: number;
		hostingChannelId: number;
	};
	isFullScreen: boolean;
	isMuted: boolean;
	isPaused: boolean;
	isTheatreMode: boolean;
	language: string;
	mode: 'viewer' | 'dashboard' | 'config';
	playbackMode: 'video' | 'audio' | 'remote' | 'chat-only';
	theme: 'light' | 'dark';
	videoResolution: string;
	volume: number;
}

export interface ExtensionRig {
	log(message: string): void;
}

export interface ExtensionActions {
	followChannel(channelName: string): void;
	minimize(): void;
	onFollow(cb: (didFollow: boolean, channelName: string) => void): void;
	requestIdShare(): void;
}

export interface ExtensionConfiguration {
	broadcaster: { version: string; content: string } | undefined;
	developer: { version: string; content: string } | undefined;
	global: { version: string; content: string } | undefined;
	onChanged(cb: () => void): void;
	set(segment: 'broadcaster', version: string, content: string): void;
}
