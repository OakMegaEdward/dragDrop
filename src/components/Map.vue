<template id="map-interface">
  <div class="wrap">
    <div class="example">
      <label class="upload-btn" for="upload">
        <input type="file" name="upload" @change="updateImg" />
      </label>
    </div>
    <div
      class="imgbody"
      @mouseover="dropMap"
      :style="{ backgroundImage: 'url(' + representImg + ')' }"
    >
      <InterTown
        v-for="(item, index) in townList"
        :key="index"
        :data="item"
        :id="item.retcId"
        @over="removeListener"
      />
      <!-- <town
      @destroytown="destroyComponent"
      @selecttype="changeSelect"
      @selectedit="changeEdit"
      v-for="item in townList"
      :town="item"
      :key="item.retcId"
    /> -->
    </div>
  </div>
</template>

<script>
import Town from './Town.vue'
import InterTown from './InterTown.vue'
export default {
  components: { Town, InterTown },
  data() {
    return {
      townList: [],
      isSelect: false,
      isEdit_map: false,
      isDown: false,
      minSizeSet: 50,
      mouse: {
        startX: '',
        startY: '',
        retLeft: '',
        retcTop: '',
        retcHeight: '',
        retcWidth: '',
        retcId: 0,
        retcborder: 0
      },
      wId: 'borderdiv',
      representImg: ''
    }
  },
  computed: {
    mapOffsetTop() {
      const imgbody = document.querySelector('.imgbody')
      return imgbody.getClientRects()[0].top
    },
    mapClientY() {
      const imgbody = document.querySelector('.imgbody')
      return imgbody.clientY
    }
    // mapOffsetLeft(){
    //   const imgbody = document.querySelector('.imgbody')
    //     return imgbody.getClientRects()[0].left
    // }
  },
  methods: {
    changeSelect(boolean) {
      this.isSelect = boolean
    },
    changeEdit(boolean) {
      this.isEdit_map = boolean
    },
    destroyComponent(townid) {
      this.townList.forEach((item, index) => {
        if (item.retcId === townid) {
          this.townList.splice(index, 1)
        }
      })
    },
    map_mouseDown(e) {
      const evt = e || window.event
      if (evt.buttons !== 1) return
      const imgbody = document.querySelector('.imgbody')
      const scrollTop = document.documentElement.scrollTop
      const scrollLeft = document.documentElement.scrollLeft
      // console.log(
      //   'imgtop',
      //   imgbody.getClientRects()[0].top,
      //   'e.clientY',
      //   evt.clientY,
      //   'scrolltop',
      //   scrollTop
      // )
      if (!this.isSelect) {
        this.isSelect = true
        this.isDown = true
        const selectArea = document.createElement('div')
        this.mouse.startY = evt.clientY - imgbody.getClientRects()[0].top
        // imgbody.getClientRects()[0].top > 0
        //   ? evt.clientY - imgbody.getClientRects()[0].top
        //   : evt.clientY
        this.mouse.startX = evt.clientX - imgbody.getClientRects()[0].left
        // imgbody.getClientRects()[0].left > 0
        //   ? evt.clientX - imgbody.getClientRects()[0].left
        //   : evt.clientX
        setTimeout(() => {
          selectArea.className = 'div'
          selectArea.id = this.wId
          selectArea.style.left = this.mouse.startX + 'px'
          selectArea.style.top = this.mouse.startY + 'px'
          imgbody.appendChild(selectArea)
        }, 0)
      }
    },
    map_mouseMove(e) {
      const imgbody = document.querySelector('.imgbody')
      const evt = e || window.event
      // console.log(
      //   'startY',
      //   this.mouse.startY,
      //   'imgtop',
      //   imgbody.getClientRects()[0].top,
      //   'e.clientY',
      //   evt.clientY,
      //   'scrolltop',
      //   imgbody.scrollTop
      // )
      // imgbody.getClientRects()[0].top 點距離邊的高
      // clientY 點距離頁面的高

      // console.log(e)
      this.mouse.retcTop =
        this.mouse.startY + imgbody.getClientRects()[0].top - evt.clientY > 0
          ? evt.clientY - imgbody.getClientRects()[0].top
          : this.mouse.startY
      this.mouse.retcLeft =
        this.mouse.startX + imgbody.getClientRects()[0].left - evt.clientX > 0
          ? evt.clientX - imgbody.getClientRects()[0].left
          : this.mouse.startX
      this.mouse.retcHeight = Math.abs(
        this.mouse.startY + imgbody.getClientRects()[0].top - evt.clientY
      )
      this.mouse.retcWidth = Math.abs(
        this.mouse.startX + imgbody.getClientRects()[0].left - evt.clientX
      )

      this.mouse.retcId = `town${Math.abs(
        this.mouse.startX + this.mouse.startY
      )}`
      this.mouse.retcborder = `townborder${Math.abs(
        this.mouse.startX + this.mouse.startY
      )}`
      this.$(this.wId).style.left = this.mouse.retcLeft + 'px'
      this.$(this.wId).style.top = this.mouse.retcTop + 'px'
      this.$(this.wId).style.width = this.mouse.retcWidth + 'px'
      this.$(this.wId).style.height = this.mouse.retcHeight + 'px'
      // console.log(this.mouse)
    },
    map_mouseUp() {
      const imgbody = document.querySelector('.imgbody')
      this.isSelect = false
      imgbody.removeChild(this.$(this.wId))
      // const endDiv = document.createElement('div')
      if (
        parseInt(this.mouse.retcWidth) >= this.minSizeSet &&
        parseInt(this.mouse.retcHeight) >= this.minSizeSet
      ) {
        // console.log(this.mouse)
        this.townList.push(this.mouse)
      }
      this.mouse = {}
      this.isDown = false
      document.removeEventListener('mousedown', this.map_mouseDown)
      document.removeEventListener('mousemove', this.map_mouseMove)
      document.removeEventListener('mouseup', this.map_mouseUp)
    },
    $(id) {
      return document.getElementById(id)
    },
    removeListener() {
      console.log('remove')
      document.removeEventListener('mousedown', this.map_mouseDown)
      document.removeEventListener('mousemove', this.map_mouseMove)
      document.removeEventListener('mouseup', this.map_mouseUp)
    },
    dropMap(e) {
      if (e.target && e.target.className === 'draggable') return
      console.log('create')
      if (!this.isEdit_map) {
        document.addEventListener('mousedown', this.map_mouseDown)
        if (this.isSelect && this.isDown) {
          document.addEventListener('mousemove', this.map_mouseMove)
        }
        if (this.isDown) {
          document.addEventListener('mouseup', this.map_mouseUp)
        }
      }
    },
    updateImg($event) {
      console.log($event)
      const fr = new FileReader()
      fr.readAsDataURL($event.target.files[0])
      const vm = this
      fr.onload = function() {
        vm.representImg = fr.result
      }
      //   const firebaseConfig = {
      //     apiKey: '',
      //     authDomain: 'chatroomdemo-428e2.firebaseapp.com',
      //     databaseURL: 'https://chatroomdemo-428e2.firebaseio.com',
      //     projectId: 'chatroomdemo-428e2',
      //     storageBucket: 'chatroomdemo-428e2.appspot.com',
      //     // messagingSenderId: '',
      //     // appId: '',
      //   };
      // const db = firebase.initializeApp(firebaseConfig).firestore();
      //   console.log(event.target.files)
      //   const updateFile = event.target.files[0]
      //   const storageRef = firebase.storage().ref()
      //   const mountainRef = storageRef.child(`OkadaImg/${updateFile}`)
      //   mountainRef.put(updateFile).then(snapshot => {
      //     snapshot.ref.getDownloadURL().then(imageUrl => {
      //       db.collection('defaultImg').doc(updateFile.name)
      //         .set({
      //           imgUrl: imageUrl,
      //           type: updateFile.type,
      //           size: updateFile.size
      //         })
      //         .then(res => {
      //           console.log(res)
      //           this.getImg(updateFile.name)
      //         })
      //         .catch(err => {
      //           console.log(err)
      //         })
      //     })
      //   })
    }
    // getImg(imgName) {
    //   var docRef = db.collection('defaultImg').doc(imgName)
    //   docRef
    //     .get()
    //     .then(function(doc) {
    //       if (doc.exists) {
    //         console.log('Document data:', doc.data())
    //         this.recentImgUrl = doc.data().imgUrl
    //         localStorage.setItem('latestImg', doc.data().imgUrl)
    //       } else {
    //         // doc.data() will be undefined in this case
    //         console.log('No such document!')
    //       }
    //     })
    //     .catch(function(error) {
    //       console.log('Error getting document:', error)
    //     })
    // }
  }
}
</script>

<style lang="scss">
.example {
  /* padding-top: 500px; */
}
.example-2 {
  padding-top: 235px;
}
.wrap {
  position: relative;
}
.upload-btn {
  display: block;
  border: 2px dashed blue;
  width: 250px;
  border-radius: 10px;
  position: relative;
  margin-bottom: 20px;
  input {
    outline: none;
    opacity: 0;
  }
  &::before {
    content: '請上傳圖片';
    position: absolute;
    width: 100%;
    height: 24px;
    top: calc(50% - 12px);
    left: 0;
  }
}
.imgbody {
  border: 1px solid black;
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: 1000px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 99;
  /* cursor:move; */
}
.div {
  position: absolute;
  border: 5px solid blue;
  width: 0px;
  height: 0px;
  left: 0px;
  top: 0px;
  overflow: hidden;
  z-index: 100;
}
.retc_border {
  /* display: flex;
    justify-content: center;
    align-items: center; */
  position: absolute;
  border: 1px solid black;
  overflow: hidden;
  opacity: 0.7;
  z-index: 100;
  /* padding: 10px; */
  background-color: #efefef;
}
.retc {
  min-width: 50px;
  min-height: 50px;
  background-color: #efefef;
  position: relative;
}
.selected {
  border: 3px black solid;
}
.town_body {
  position: relative;
  background-color: #ffffff;
}
.delete {
  color: black;
  position: absolute;
  top: -1px;
  right: 0;
  font-size: 16px;
  z-index: 101;
}
#edit {
  width: 30px;
  height: 30px;
  position: absolute;
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
  z-index: 101;
}
input {
  box-sizing: border-box;
  width: 100%;
}
.draggable {
  cursor: move;
}
</style>
