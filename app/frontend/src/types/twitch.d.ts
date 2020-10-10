// Types for the twitch extension helper.
// Reference: https://dev.twitch.tv/docs/extensions/reference#javascript-helper
// https://dev.twitch.tv/docs/extensions/reference/#helper-extensions

// tslint:disable:interface-name
declare global {
	interface Window {
		Twitch?: {
			ext: Extension;
		};
	}
}

export interface Product {
	cost: {
		type: string; // bits
		amount: number;
	};
	displayName: string;
	inDevelopment: boolean | undefined;
	sku: string; // unique product id
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
	bits: BitsInExtension;
	features: ExtensionFlags;
}

export interface ExtensionFlags {
	isBitsEnabled: boolean;
	isChatEnabled: boolean;
	onChanged: (callback: () => [string]) => void;
}

export interface TransactionObject {
	displayName: string;
	initiator: 'current_user' | 'other';
	product: {
		broadcast: boolean;
		cost: {
			amount: number;
			type: string; // bits
		};
		displayName: string;
		domain: string;
		inDevelopment: boolean | undefined;
		sku: string;
	};
	transactionId: string;
	transactionReceipt: string;
	userId: string;
}

export interface BitsInExtension {
	getProducts: () => Promise<Product[]>;
	useBits: (sku: string) => void;
	showBitsBalance: () => void;
	setUseLoopback: () => boolean;
	onTransactionCancelled: (callback: () => void) => void;
	onTransactionComplete: (
		callback: (transactionObject: TransactionObject) => void
	) => void;
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
