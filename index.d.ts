import { AnimationItem } from 'lottie-web';

export type Point = [number, number];

export type ScaleData = {
	scaleYOffset: number
	scaleXOffset: number
	scale: number
}

export interface LayerList {
	getLayers(): LayerList,
	getLayersByType(type: number): LayerList,
	getLayersByName(name: string): LayerList,
	layer(index: number): [] | any,
	concat(list: any[]): any[],
	getTargetElements(): any[],
	readonly length: number;
}

export interface KeyPathList {
	getKeyPath(propertyPath: string): any;
	concat(nodes: KeyPathList): KeyPathList;
	getElements(): any[];
	getPropertyAtIndex(index: number): any;
	readonly length: number;
}

export interface AnimationItemAPI extends KeyPathList, LayerList {
	getRendererType(): string;

	recalculateSize(): void;
	getScaleData(): ScaleData;
	toContainerPoint(point: Point): Point;
	fromContainerPoint(point: Point): Point;
	getCurrentFrame(): number;
	getCurrentTime(): number;
	addValueCallback(properties: KeyPathList, value: any): void;
	toKeypathLayerPoint(properties: KeyPathList, point: Point): Point | Point[];
	fromKeypathLayerPoint(properties: KeyPathList, point: Point): Point | Point[];
}

export type LottieAPI = {
	createAnimationApi(animationInstance: AnimationItem): AnimationItemAPI;
}

declare const LottieAPIModule: LottieAPI;

export default LottieAPIModule;
