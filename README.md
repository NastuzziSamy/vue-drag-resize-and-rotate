<h1 align="center">Vue Drag Resize And Rotate</h1>

[![Latest Version on NPM](https://img.shields.io/npm/v/VueDragResizeAndRotate-and-rotate.svg?style=flat-square)](https://npmjs.com/package/VueDragResizeAndRotate-and-rotate)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/VueDragResizeAndRotate-and-rotate.svg?style=flat-square)](https://www.npmjs.com/package/VueDragResizeAndRotate-and-rotate)

> Vue Component for draggable and resizable elements.

## Table of Contents

* [Features](#features)
* [Install and basic usage](#install-and-basic-usage)
  * [Props](#props)
  * [Events](#events)
* [Contributing](#contributing)
* [License](#license)

### Demo

Not available for now

### Features

* A lightweight, no-dependency
* All props are reactive
* Support touch events
* Use
    * draggable
    * resizable
    * rotable
    * or all of them
* Define sticks for resizing
* Define sticks for rotation
* Restrict size and movement to parent element
* Restrict drag to vertical or horizontal axis
* Handle draggable areas
* Resizable and draggable even with a defined angle

## Install and basic usage

```bash
$ npm i -s VueDragResizeAndRotate-and-rotate
```


Register the component:

```js
import Vue from 'vue'
import VueDragResizeAndRotate from 'VueDragResizeAndRotate-and-rotate'

Vue.component('VueDragResizeAndRotate-and-rotate', VueDragResizeAndRotate)
```

Use the component:

```vue
<template>
    <div id="app">
        <VueDragResizeAndRotate :active="true" :w="200" :h="200" @resizing="change" @dragging="change" @rotating="change" :rotate="true">
            <h3>Hello World!</h3>
            <p>{{ y }} х {{ x }} </p>
            <p>{{ w }} х {{ h }}</p>
        </VueDragResizeAndRotate>
    </div>
</template>

<script>
    import VueDragResizeAndRotate from 'VueDragResizeAndRotate-and-rotate';

    export default {
        name: 'app',

        components: {
            VueDragResizeAndRotate
        },

        data() {
            return {
                w: 0,
                h: 0,
                x: 0
                y: 0,
            }
        },

        methods: {
            change(newRect) {
                this.w = newRect.w;
                this.h = newRect.h;
                this.x = newRect.x;
                this.y = newRect.y;
            }
        }
    }
</script>
```

### Props

#### active
Type: `Boolean`<br />
Required: `false`<br />
Default: `false`

Determines whether the component should be active.

```html
<VueDragResizeAndRotate :active="true">
```

#### draggable
Type: `Boolean`<br />
Required: `false`<br />
Default: `true`

Determines whether the component should be draggable.

```html
<VueDragResizeAndRotate :draggable="false">
```

#### resizable
Type: `Boolean`<br />
Required: `false`<br />
Default: `true`

Determines whether the component should be resizable.

```html
<VueDragResizeAndRotate :resizable="false">
```

#### grid
Type: `Array`<br />
Required: `false`<br />
Default: `[0, 0]`

Determines pixel distance beetween each drag

```html
<VueDragResizeAndRotate :grid="[10, 10]">
```

#### bounds
Type: `Object`<br />
Required: `false`<br />
Default: `undefined`

Limits the scope of the component's change to its parent size.
Variable parameters can be set (none of them are required):
* parent: `Boolean`
* top: `Number`
* right: `Number`
* bottom: `Number`
* left: `Number`

```html
<VueDragResizeAndRotate :bounds="{parent: true}">
<VueDragResizeAndRotate :bounds="{top: -100, bottom: 100}">
<VueDragResizeAndRotate :bounds="{top: -100, right: 100, bottom: 100, left: -100}">
```

#### w
Type: `Number`<br />
Required: `false`<br />
Default: `200`

Define the initial width of the component.

```html
<VueDragResizeAndRotate :w="500">
```

#### h
Type: `Number`<br />
Required: `false`<br />
Default: `200`

Define the initial height of the component.

```html
<VueDragResizeAndRotate :h="500">
```

#### x
Type: `Number`<br />
Required: `false`<br />
Default: `0`

Define the initial x position of the component.

```html
<VueDragResizeAndRotate :x="500">
```

#### y
Type: `Number`<br />
Required: `false`<br />
Default: `0`

Define the initial y position of the component.

```html
<VueDragResizeAndRotate :y="500">
```

#### r
Type: `Number`<br />
Required: `false`<br />
Default: `0`

Define the initial rotation angle in degrees of the component.

```html
<VueDragResizeAndRotate :r="45">
```

#### sticks
Type: `Array`<br />
Required: `false`<br />
Default: `['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'ro']`

Define the array of handles to restrict the element resizing:
* `tl` - Top left
* `tm` - Top middle
* `tr` - Top right
* `mr` - Middle right
* `br` - Bottom right
* `bm` - Bottom middle
* `bl` - Bottom left
* `ml` - Middle left
* `ro` - Rotation stick

```html
<VueDragResizeAndRotate :sticks="['tm','bm','ml','mr']">
<VueDragResizeAndRotate :sticks="['ro']">
```

#### axis
Type: `String`<br />
Required: `false`<br />
Default: `xy`

Define the axis on which the element is draggable. Available values are `x`, `y`, `xy`. Other values are equivalent to `none`

```html
<VueDragResizeAndRotate axis="x">
```

#### dragHandle
Type: `String`<br />
Required: `false`<br />
Default: `undefined`

Defines the selector that should be used to drag the component.

```html
<VueDragResizeAndRotate dragHandle=".drag">
```

#### dragCancel
Type: `String`<br />
Required: `false`<br />
Default: `undefined`

Defines a selector that should be used to prevent drag initialization.

```html
<VueDragResizeAndRotate dragCancel=".drag">
```

#### dragCancel
Type: `String`<br />
Required: `false`<br />
Default: `undefined`

Defines a selector that should be used to prevent drag initialization.

```html
<VueDragResizeAndRotate dragCancel=".drag">
```





---

### Events

#### clicked

Required: `false`<br />
Parameters: `-`

Called whenever the component gets clicked.

```html
<VueDragResizeAndRotate @activated="onActivated">
```

#### activated

Required: `false`<br />
Parameters: `-`

Called whenever the component gets clicked, in order to show handles.

```html
<VueDragResizeAndRotate @activated="onActivated">
```

#### deactivated

Required: `false`<br />
Parameters: `-`

Called whenever the user clicks anywhere outside the component, in order to deactivate it.

```html
<VueDragResizeAndRotate @deactivated="onDeactivated">
```

#### resizing

Required: `false`<br />
Parameters: `object`
```javascript
{
    left: Number, //the X position of the component
    top: Number, //the Y position of the component
    width: Number, //the width of the component
    height: Number //the height of the component
}
```

Called whenever the component gets resized.

```html
<VueDragResizeAndRotate @resizing="onResizing">
```

#### resizestop

Required: `false`<br />
Parameters: `object`
```javascript
{
    left: Number, //the X position of the component
    top: Number, //the Y position of the component
    width: Number, //the width of the component
    height: Number //the height of the component
}
```

Called whenever the component stops getting resized.

```html
<VueDragResizeAndRotate @resizestop="onResizstop">
```

#### dragging

Required: `false`<br />
Parameters: `object`
```javascript
{
    left: Number, //the X position of the component
    top: Number, //the Y position of the component
    width: Number, //the width of the component
    height: Number //the height of the component
}
```

Called whenever the component gets dragged.

```html
<VueDragResizeAndRotate @dragging="onDragging">
```

#### dragstop

Required: `false`<br />
Parameters: `object`
```javascript
{
    left: Number, //the X position of the component
    top: Number, //the Y position of the component
    width: Number, //the width of the component
    height: Number //the height of the component
}
```


Called whenever the component stops getting dragged.

```html
<VueDragResizeAndRotate @dragstop="onDragstop">
```

## Contributing

Any contribution to the code or any part of the documentation and any idea and/or suggestion are very welcome.

``` bash
# serve with hot reload at localhost:8081
npm run start

# distribution build
npm run build

```

## License

[MIT license](LICENSE)
