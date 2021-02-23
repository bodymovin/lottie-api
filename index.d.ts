import { AnimationItem } from 'lottie-web';

export type Point = [number, number];

export type ScaleData = {
	scaleYOffset: number
	scaleXOffset: number
	scale: number
}

export interface AnimationItemAPI {
	recalculateSize(): void;
	getScaleData(): ScaleData;
	toContainerPoint(point: Point): Point;
	fromContainerPoint(point: Point): Point;
	getCurrentFrame(): number;
	getCurrentTime(): number;
	addValueCallback(): void;
	toKeypathLayerPoint(): Point | Point[];
	fromKeypathLayerPoint(): Point | Point[];
}

export type LottieAPI = {
	createAnimationApi(animationInstance: AnimationItem): AnimationItemAPI;
}

declare const LottieAPIModule: LottieAPI;

export default LottieAPIModule;
