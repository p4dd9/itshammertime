export type EffectShape = 'circle' | 'star' | 'square' | 'leaf';

export type ParticleEffectTheme = string | string[];

export default interface IEffectSettings {
	particleTheme: ParticleEffectTheme;
	shape: EffectShape;
}
