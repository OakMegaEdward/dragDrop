<template>
  <div
    @click.prevent="startKeyupMove"
    @mouseover="selectTrue"
    @mouseleave="selectFalse"
    class="retc_border"
    draggable="false"
    :id="town.retcborder"
    :style="{
      top: town.retcTop + 'px',
      left: town.retcLeft + 'px'
    }"
  >
    <div
      draggable="true"
      @mouseover="selectTrue"
      @mouseleave="selectFalse"
      class="retc"
      :id="town.retcId"
      :style="{
        width: town.retcWidth + 'px',
        height: town.retcHeight + 'px'
      }"
    >
      <div class="town_input_group">
        <label for=""></label>
        <input type="text" v-model="townInfo.retcId" />
      </div>
    </div>
    <i class="fas fa-times-circle delete" @click.prevent="destroyTown"></i>
    <div id="edit" v-if="!isDrag" draggable="false" @mousedown="editSize"></div>
  </div>
</template>

<script>
export default {
  props: {
    town: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      townInfo: this.town,
      mouseOnId: '',
      editStartX: '',
      editStartY: '',
      editEndX: '',
      editEndY: '',
      isDown: false,
      isEdit: false,
      isDrag: false,
      isFocus: false,
      xlength: 0,
      ylength: 0
    }
  },
  mounted() {
    const vm = this
    let isStart = false
    let startX = 0
    let startY = 0
    const map = document.querySelector('.imgbody')
    const town = document.getElementById(this.townInfo.retcborder)
    if (!this.isEdit) {
      town.addEventListener('dragstart', e => {
        const inputTarget = document.querySelector('.town_input_group input')
        inputTarget.blur()
        vm.isDrag = true
        vm.isEdit = false
        isStart = false
        if (!isStart) {
          isStart = true
          startX = e.x
          startY = e.y
          const selectedlist = document.querySelectorAll('.selected')
          if (selectedlist.length === 1) {
            selectedlist[0].classList.remove('selected')
          }
          town.classList.add('selected')
        }
      })
      map.addEventListener('dragover', e => {
        e.preventDefault()
        vm.isEdit = false
      })
      map.addEventListener('drop', e => {
        e.preventDefault()
        console.log(e)
        if (isStart && this.mouseOnId !== '') {
          vm.isStart = false
          town.style.left = parseInt(town.style.left) + (e.x - startX) + 'px'
          town.style.top = parseInt(town.style.top) + (e.y - startY) + 'px'
          town.classList.remove('selected')
          vm.isDrag = false
          vm.isEdit = false
        }
      })
    }
  },
  methods: {
    selectTrue(e) {
      this.$emit('selecttype', true)
      this.mouseOnId = e.target.id
    },
    selectFalse() {
      this.$emit('selecttype', false)
      this.mouseOnId = ''
    },
    destroyTown() {
      this.$emit('destroytown', this.townInfo.retcId)
      this.$emit('selecttype', false)
    },
    startKeyupMove(e) {
      if (
        e.target.id === this.townInfo.retcId ||
        e.target.id === this.townInfo.retcborder
      ) {
        this.isFocus = true
      }
      const target = document.getElementById(this.townInfo.retcborder)
      if (this.isFocus) {
        const selectedlist = document.querySelectorAll('.selected')
        if (selectedlist.length === 1) {
          selectedlist[0].classList.remove('selected')
        }
        target.classList.add('selected')
        document.onkeydown = function(e) {
          e.preventDefault()
          // console.log(e)
          const move = {
            38: {
              direction: 'top',
              repeat_distance: -3,
              distance: -1
            },
            40: {
              direction: 'top',
              repeat_distance: 3,
              distance: 1
            },
            37: {
              direction: 'left',
              repeat_distance: -3,
              distance: -1
            },
            39: {
              direction: 'left',
              repeat_distance: 3,
              distance: 1
            }
          }
          target.style[move[e.keyCode].direction] = parseInt(
            target.style[move[e.keyCode].direction] + e.repeat
              ? move[e.keyCode].repeat_distance
              : move[e.keyCode].distance + 'px'
          )
        }
      }
    },
    edit_mouseDown(e) {
      e.preventDefault()
      // console.log('down',e)
      this.editStartX = e.x
      this.editStartY = e.y
      this.isDown = true
    },
    edit_mouseMove(e) {
      const vm = this
      const imgbody = document.querySelector('.imgbody')
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      const scrollLeft =
        document.body.scrollLeft || document.documentElement.scrollLeft
      if (this.isDown) {
        e.preventDefault()
        const selectTown = document.getElementById(this.townInfo.retcId)
        this.editEndX = e.x
        this.editEndY = e.y
        // console.log('ey',e.y,'scrolltop',scrollTop,'imgtop',imgbody.getClientRects()[0].top,'starty',vm.townInfo.startY)
        if (this.editEndX + scrollLeft >= this.townInfo.startX) {
          selectTown.style.width =
            e.x - imgbody.getClientRects()[0].left - vm.townInfo.startX <= 0
              ? parseInt(selectTown.style.width) + 'px'
              : parseInt(selectTown.style.width) + e.movementX + 'px'
          // if (
          //   e.x - imgbody.getClientRects()[0].left - vm.townInfo.startX <=
          //   0
          // ) {
          //   selectTown.style.width = parseInt(selectTown.style.width) + 'px'
          // } else {
          //   selectTown.style.width =
          //     parseInt(selectTown.style.width) + e.movementX + 'px'
          // }
        }
        if (this.editEndY + scrollTop >= this.townInfo.startY) {
          selectTown.style.height =
            e.y - imgbody.getClientRects()[0].top - vm.townInfo.startY <= 0
              ? parseInt(selectTown.style.height) + 'px'
              : parseInt(selectTown.style.height) + e.movementY + 'px'
          // if (e.y - imgbody.getClientRects()[0].top - vm.townInfo.startY <= 0) {
          //   selectTown.style.height = parseInt(selectTown.style.height) + 'px'
          // } else {
          //   selectTown.style.height =
          //     parseInt(selectTown.style.height) + e.movementY + 'px'
          // }
        }
      }
    },
    edit_mouseUp(e) {
      // console.log('up',e)
      e.preventDefault()
      this.isEdit = false
      this.$emit('selectedit', false)
      this.isDown = false
      document.removeEventListener('mousedown', this.edit_mouseDown)
      document.removeEventListener('mousemove', this.edit_mouseMove)
      document.removeEventListener('mouseup', this.edit_mouseUp)
    },
    editSize(e) {
      this.$emit('selectedit', true)
      const vm = this
      const selectTown = document.getElementById(this.townInfo.retcId)
      if (e.target.id === 'edit' && !vm.isDrag) {
        vm.isEdit = true
        vm.isDown = false
        selectTown.draggable = false
      }
      if (
        selectTown !== '' &&
        e.target.id === 'edit' &&
        vm.isEdit &&
        !vm.isDown &&
        !vm.isDrag
      ) {
        document.addEventListener('mousedown', vm.edit_mouseDown)
        document.addEventListener('mousemove', vm.edit_mouseMove)
        document.addEventListener('mouseup', vm.edit_mouseUp)
      }
      selectTown.draggable = true
    }
  }
}
</script>
