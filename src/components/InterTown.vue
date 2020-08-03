<template>
  <div
    :id="id"
    :ref="id"
    class="draggable"
    @mouseover.prevent.stop="mouseOver"
    @mouseleave="mouseLeave"
  >
    <p>You can drag one element</p>
  </div>
</template>

<script>
import interact from 'interactjs'

export default {
  props: {
    id: {
      type: String,
      requried: true
    },
    data: {
      type: Object,
      requried: true
    }
  },
  created() {
    this.$nextTick(() => {
      let dom = document.getElementById(this.id)
      dom.style.width = this.data.retcWidth + 'px'
      dom.style.height = this.data.retcHeight + 'px'
      dom.style.webkitTransform = dom.style.transform =
        'translate(' + this.data.retcLeft + 'px, ' + this.data.retcTop + 'px)'
      this.$emit('over')
      interact('#' + this.id)
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event) {
              let target = event.target
              let x = parseFloat(target.getAttribute('data-x')) || 0
              let y = parseFloat(target.getAttribute('data-y')) || 0

              // update the element's style
              target.style.width = event.rect.width + 'px'
              target.style.height = event.rect.height + 'px'

              // translate when resizing from top or left edges
              x += event.deltaRect.left
              y += event.deltaRect.top
              target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)'
              target.setAttribute('data-x', x)
              target.setAttribute('data-y', y)
              target.textContent =
                Math.round(event.rect.width) +
                '\u00D7' +
                Math.round(event.rect.height)
            }
          },
          modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
              outer: 'parent'
            }),

            // minimum size
            interact.modifiers.restrictSize({
              min: { width: 100, height: 50 }
            })
          ],
          inertia: true
        })
        .draggable({
          listeners: { move: this.dragMoveListener },
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true
            })
          ]
        })
    })
  },
  methods: {
    mouseOver() {
      this.$emit('over')
    },
    mouseLeave() {
      this.$emit('leave')
    },
    dragMoveListener(event) {
      this.$emit('over')
      const target = event.target
      // keep the dragged position in the data-x/data-y attributes
      const x =
        (parseFloat(target.getAttribute('data-x')) || this.data.retcLeft) +
        event.dx
      const y =
        (parseFloat(target.getAttribute('data-y')) || this.data.retcTop) +
        event.dy
      // translate the element
      target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
  }
}
</script>

<style lang="scss" scoped>
.draggable {
  background-color: #29e;
  color: white;
  font-size: 20px;
  font-family: sans-serif;
  border-radius: 8px;
  padding: 20px;
  touch-action: none;
  width: 120px;
  position: absolute;
  /* This makes things *much* easier */
  box-sizing: border-box;
}
</style>
