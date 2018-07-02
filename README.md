# lottie-api
A library to edit lottie-web animations dynamically

## Methods
### createAnimationApi
- Expects 1 argument: the lottie animation instance
- Returns animation API instance
- This is the only method of the library. It will return an instance of an API connected to the animation it gets as argument.
Returns

## Animation Instance

## Usage
For a basic usage check the examples folder.

## Additional methods

- getKeyPath: returns a keypath pointing to an animation property
- addValueCallback: adds a callback to an animation property
- recalculateSize: call this method if the element gets resized
- toContainerPoint: converts a point from animation coordinates to global coordinates
- fromContainerPoint: converts a point from global coordinates to animation coordinates
- toKeypathLayerPoint: converts a point from global animation coordinates to property animation coordinates
- fromKeypathLayerPoint: converts a point from property animation coordinates to global animation coordinates
- getCurrentFrame: return current animation time in frames
- getCurrentTime: return current animation time in seconds