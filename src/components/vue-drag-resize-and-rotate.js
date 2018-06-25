import Vector from 'victor'

let findInArray = function(array, callback) {
  for (let i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i]
  }
}

let isFunction = function(func) {
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]'
}

let isNum = function(num) {
  return typeof num === 'number' && !isNaN(num)
}

let int = function(a) {
  return parseInt(a, 10)
}

let outerHeight = function(node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight
  let computedStyle = window.getComputedStyle(node)
  height += int(computedStyle.borderTopWidth)
  height += int(computedStyle.borderBottomWidth)
    // height += int(computedStyle.marginTop);
    // height += int(computedStyle.marginBottom);
  return height
}

let outerWidth = function(node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  let width = node.clientWidth
  let computedStyle = window.getComputedStyle(node)
  width += int(computedStyle.borderLeftWidth)
  width += int(computedStyle.borderRightWidth)
    // width += int(computedStyle.marginLeft);
    // width += int(computedStyle.marginRight);
  return width
}
let innerHeight = function(node) {
  let height = node.clientHeight
  let computedStyle = window.getComputedStyle(node)
  height -= int(computedStyle.paddingTop)
  height -= int(computedStyle.paddingBottom)
  return height
}

let innerWidth = function(node) {
  let width = node.clientWidth
  let computedStyle = window.getComputedStyle(node)
  width -= int(computedStyle.paddingLeft)
  width -= int(computedStyle.paddingRight)
  return width
}

let matchesSelectorFunc = ''
let matchesSelector = function(el, selector) {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray([
      'matches',
      'webkitMatchesSelector',
      'mozMatchesSelector',
      'msMatchesSelector',
      'oMatchesSelector'
    ], function(method) {
      return isFunction(el[method])
    })
  }

  return el[matchesSelectorFunc].call(el, selector)
}

let getBoundPosition = function(bounds, node, clientX, clientY) {
  // If no bounds, short-circuit and move on
  if (!bounds) return [clientX, clientY]

  let parent = node.parentNode

  if (bounds.parent) {
    let nodeStyle = window.getComputedStyle(node)
    let parentStyle = window.getComputedStyle(parent)
      // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
    bounds = {
      left: -node.offsetLeft + int(parentStyle.paddingLeft) +
        int(nodeStyle.borderLeftWidth) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(parentStyle.paddingTop) +
        int(nodeStyle.borderTopWidth) + int(nodeStyle.marginTop),
      right: innerWidth(parent) - node.offsetLeft - outerWidth(node),
      bottom: innerHeight(parent) - outerHeight(node) - node.offsetTop
    }
  }

  // Keep x and y below right and bottom limits...
  if (isNum(bounds.right)) clientX = Math.min(clientX, bounds.right)
  if (isNum(bounds.bottom)) clientY = Math.min(clientY, bounds.bottom)

  // But above left and top limits.
  if (isNum(bounds.left)) clientX = Math.max(clientX, bounds.left)
  if (isNum(bounds.top)) clientY = Math.max(clientY, bounds.top)

  return [clientX, clientY]
}


/* Component definition */

export default {
  replace: true,
  name: 'dragable',
  props: {
    w: {
      type: Number,
      default: 200
    },
    h: {
      type: Number,
      default: 200
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    r: {
      type: Number,
      default: 0
    },
    active: {
        type: Boolean,
        default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    rotable: {
      type: Boolean,
      default: false
    },
    axis: {
      type: String,
      default: 'xy'
    },
    dragHandle: {
      type: String,
      default: undefined
    },
    dragCancel: {
      type: String,
      default: undefined
    },
    sticks: {
        type: Array,
        default: function () {
            return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'ro']
        },
        validator: function (array) {
            return array.filter(el => {
                return !['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'ro'].includes(el)
            }).length === 0;
        }
    },
    grid: {
      type: Array,
      default: function() {
        return [0, 0]
      }
    },
    bounds: {
      type: Object,
      default: undefined
    }
  },
  watch: {
      active: function (active) {
          this.attachEvents()
          this.setActive(active)
      }
  },
  beforeDestroy: function() {
    this.detachEvents()
  },
    methods: {
        attachEvents: function () {
          var el = document.documentElement

          this.detachEvents()

          if (el.attachEvent) {
              el.attachEvent('onmousemove', this.mouseMove)
              el.attachEvent('onmouseup', this.handleUp)
              el.attachEvent('onmousedown', this.mouseDown)
          } else if (el.addEventListener) {
              el.addEventListener('mousemove', this.mouseMove, true)
              el.addEventListener('mouseup', this.handleUp)
              el.addEventListener('mousedown', this.mouseDown)
          } else {
              el['onmousemove'] = this.mouseMove
              el['onmouseup'] = this.handleUp
              el['onmousedown'] = this.mouseDown
          }
        },
        detachEvents: function () {
            var el = document.documentElement

            if (el.attachEvent) {
                el.detachEvent('onmousedown')
            } else if (el.addEventListener) {
                el.removeEventListener('mousedown', this.mouseDown)
            } else {
                el['onmousedown'] = null
            }

            this.detachMovementEvents()
        },
        detachMovementEvents: function () {
            var el = document.documentElement

            if (el.attachEvent) {
                el.detachEvent('onmousemove')
                el.detachEvent('onmouseup')
            } else if (el.addEventListener) {
                el.removeEventListener('mousemove', this.mouseMove)
                el.removeEventListener('mouseup', this.handleUp)
            } else {
                el['onmousemove'] = null
                el['onmouseup'] = null
            }
        },
        setActive: function (active) {
            if (this.localactive !== active) {
                this.localactive = active
                this.$emit(active ? 'activation' : 'desactivation')
            }
        },
        setDrag: function (drag) {
            if (this.dragging !== drag) {
                this.dragging = drag
                this.$emit(drag ? 'dragging' : 'dragstop', {
                      x: this.localx,
                      y: this.localy,
                      w: this.localw,
                      h: this.localh,
                      r: this.localr
                  })
            }
        },
        setResize: function (resize) {
            if (this.resizing !== resize) {
                this.resizing = resize
                this.$emit(resize ? 'resizing' : 'resizestop', {
                      x: this.localx,
                      y: this.localy,
                      w: this.localw,
                      h: this.localh,
                      r: this.localr
                  })
            }
        },
        setRotate: function (rotate) {
            if (this.rotating !== rotate) {
                this.rotating = rotate
                this.$emit(rotate ? 'rotating' : 'rotatestop', {
                      x: this.localx,
                      y: this.localy,
                      w: this.localw,
                      h: this.localh,
                      r: this.localr
                  })
            }
        },
    getRotateAngle: function(x, y) {
      var rCenter = this._getCenter()
      var vStart = new Vector(this.rotateStartX - rCenter.x, this.rotateStartY - rCenter.y)
      var vEnd = new Vector(x - rCenter.x, y - rCenter.y)

      return vEnd.angleDeg() - vStart.angleDeg()
    },
    _getCenter: function() {
      var rect = this.$el.getBoundingClientRect()
      return {
        x: (rect.left + rect.right) / 2,
        y: (rect.bottom + rect.top) / 2
      }
    },
    rotateStart: function(e) {
        this.attachEvents()

      if (this.rotable) {
        this.rotateStartX = e.clientX
        this.rotateStartY = e.clientY
        this.lastR = this.localr

        this.setRotate(true)
      }
    },
    resizeStart: function(stick, e) {
        this.attachEvents()

        this.resizeStartX = e.clientX
        this.resizeStartY = e.clientY
        this.dragStartX = this.localx
        this.dragStartY = this.localy

        this.lastW = this.localw
        this.lastH = this.localh

        this.stick = stick

        this.setResize(true)
    },
    mouseDown: function(e) {
        if ((this.dragHandle && !matchesSelector(e.target, this.dragHandle)) || e.target !== this.$el) {
            this.detachEvents()
            this.setActive(false)
        }
    },
    handleDown: function(e) {
      if (this.dragHandle && !matchesSelector(e.target, this.dragHandle))
        return

      this.attachEvents()
      this.setActive(true)

      if (this.dragCancel && matchesSelector(e.target, this.dragCancel))
        return

        this.lastX = e.clientX - this.localx
        this.lastY = e.clientY - this.localy

        this.setDrag(true)
    },
    handleUp: function(e) {
        this.detachMovementEvents()

      this.setDrag(false)
      this.setResize(false)
      this.setRotate(false)
    },
    mouseMove: function(e) {
      if (e.stopPropagation) e.stopPropagation()
      if (e.preventDefault) e.preventDefault()

      if (this.dragging) {
        let deltax = e.clientX - this.lastX
        let deltay = e.clientY - this.lastY

        let deltaxround = Math.round(deltax / this.grid[0]) * this.grid[0]
        let deltayround = Math.round(deltay / this.grid[1]) * this.grid[1]
        let thisx = this.localx
        let thisy = this.localy

        if (this.grid[0] > 0 && this.grid[1] > 0) {
          if (this.axis === 'xy') {
            thisx = deltaxround
            thisy = deltayround
          } else if (this.axis === 'x') {
            thisx = deltaxround
          } else if (this.axis === 'y') {
            thisy = deltayround
          }
        } else {
          if (this.axis === 'xy') {
            thisx = e.clientX - this.lastX
            thisy = e.clientY - this.lastY
          } else if (this.axis === 'x') {
            thisx = e.clientX - this.lastX
          } else if (this.axis === 'y') {
            thisy = e.clientY - this.lastY
          }
        }

        if (this.bounds) {
          [thisx, thisy] = getBoundPosition(this.bounds, this.$el, thisx, thisy)
        }

        this.localx = thisx
        this.localy = thisy
      }
      if (this.resizing) {
          var currentStick = this.stick.split('');

          var w = parseInt(e.clientX) - parseInt(this.resizeStartX)
          var h = parseInt(e.clientY) - parseInt(this.resizeStartY)

          switch (currentStick[0]) {
              case 't':
                  this.localy = parseInt(this.dragStartY) + h;
                  h = -h
              case 'b':
                  this.localh = parseInt(this.lastH) + h;
                  break;
          }

          switch (currentStick[1]) {
              case 'l':
                  this.localx = parseInt(this.dragStartX) + w;
                  w = -w
              case 'r':
                  this.localw = parseInt(this.lastW) + w;
                  break;
          }
      }
      if (this.rotating) {
        this.localr = parseInt(this.r) + parseInt(this.lastR) + this.getRotateAngle(e.clientX, e.clientY)
      }
    }
  },

  data: function() {
    return {
      localx: this.x,
      localy: this.y,
      localw: this.w,
      localh: this.h,
      localr: this.r,
      localactive: this.active,
      lastX: 0,
      lastY: 0,
      lastW: 0,
      lastH: 0,
      lastR: 0,
      dragging: false,
      rotate: 0,
      stick: '',
      dragStartX: 0,
      dragStartY: 0,
      resizeStartX: 0,
      resizeStartY: 0,
      rotateStartX: 0,
      rotateStartY: 0,
      resizing: false,
    }
  },
  computed: {
    boxStyle: function() {
      return {
        width: this.localw + 'px',
        height: this.localh + 'px',
        transform: 'translate(' + this.localx + 'px,' + this.localy + 'px) rotate(' + this.localr + 'deg)'
      }
    }
  }
}
