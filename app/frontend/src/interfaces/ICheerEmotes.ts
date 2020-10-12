type Background = 'light' | 'dark';
type Scales = 'static' | 'animated';

interface ITier {
	can_cheer: boolean;
	color: string;
	id: string;
	images: {
		dark: {
			animated: {
				1: string;
				1.5: string;
				2: string;
				3: string;
				4: string;
			};
			static: {
				1: string;
				1.5: string;
				2: string;
				3: string;
				4: string;
			};
		};
		light: {
			animated: {
				1: string;
				1.5: string;
				2: string;
				3: string;
				4: string;
			};
			static: {
				1: string;
				1.5: string;
				2: string;
				3: string;
				4: string;
			};
		};
	};

	min_bits: string; // date with unix timestamp behind
}

interface ICheerEmote {
	prefix: string;
	background: Background[];
	priority: number;
	tiers: ITier[];
	type: string;
	updated_at: Date;
	scales: string[];
	states: Scales[];
}

export default interface ICheerEmotesResponse {
	actions: ICheerEmote[];
}
