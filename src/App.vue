<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";
</script>

<template>
  
  <div class="top-bar flex-apart light-container" style="padding:5px" data-tauri-drag-region>
    <div class="flex-center">
      <span class="text f-large f-bold" style="margin-left:20px">Welcome</span>
      <Lottie @click="openOverlay('settings')" :src="'Settings.json'" :mode="'click'" style="width:30px;margin:10px" :background="'transparent'"/>
     

    </div>
    <div class="flex-center">
      <Lottie @click="minimizeApp()" :src="'Minimize2.json'" :mode="'click'" style="width:60px" :background="'transparent'"/>
      <Lottie @click="quitApp()" :src="'Cancel.json'" :mode="'click'" style="width:60px" :background="'transparent'"/>

    </div>
    
  </div>
  <div style="margin-top:10px;">
    <div class="flex-center" style="overflow-y:hidden" :style="loading ? 'max-height:100vh' : 'max-height:0px'">
      <Lottie :src="'Loading.json'" :mode="'loop'" style="width:200px;margin-top:10px;opacity:0.6" :background="'transparent'"/>
      
    </div>
    <div class="flex-apart" style="overflow-y:hidden;overflow-x:hidden;margin:0px 40px;align-items: start;flex-wrap: wrap;height:85vh" :style="!loading ? 'max-height:100vh' : 'max-height:0px'">

      <Schedule v-if="!loading" @setcb="setCB('schedule', $event)" @setsizemode="setSizeMode($event)" :style="sizeMode == 'schedule-top' ? 'width:100%;height:40vh' : 'width:30%;height:70vh'" @popup="openPopupWithData($event.type, $event.data)"/>
      <div :style="sizeMode == 'schedule-top' ? 'width:50%;height:30vh;margin-top:20px' : 'width:30%;height:70vh;flex-direction:column;justify-content:start'" class="flex-center">
        <Notes style="" @setcb="setCB('notes', $event)" :style="sizeMode == 'schedule-top' ? 'height:100%;width:30%' : 'height:30%;width:100%'" @overlay="openOverlay('note', $event)" v-if="!loading" @encourage="addEncouragement($event)"  />
        <Canvas style="width:70%" :style="sizeMode == 'schedule-top' ? 'height:100%;width:70%' : 'height:60%;width:100%'" v-if="!loading" />
      </div>
      <!-- <Checklist /> -->
      <Checklist v-if="!loading" @setcb="setCB('checklist', $event)" @encourage="addEncouragement($event)" :style="sizeMode == 'schedule-top' ? 'width:45%;height:30vh' : 'width:30%;height:70vh'" />
      
      
    </div>
    
  </div>

  <div class="bottom-menu" :style="bottomPanelMode == 'disable' ? 'bottom:-400px;opacity:0' : 'opacity:1'">
    <div class="flex-center" style="justify-content: left;">
      <div class="raised-container">
        <div class="flex-center" v-if="bottomPanelMode == 'leds'">
          <div class="color-box cursor-pointer" style="background-color: red;" @click="setColor('red')">
            <Lottie :src="'LookDown2.json'" :mode="'click'" style="width:30px;opacity: 0.6;" :background="'transparent'"/>
          </div>
          <div class="color-box cursor-pointer" style="background-color: orange;" @click="setColor('amber')">
            <Lottie :src="'LookDown2.json'" :mode="'click'" style="width:30px;opacity: 0.6;" :background="'transparent'"/>
          </div>
          <div class="color-box cursor-pointer" style="background-color: yellow;" @click="setColor('yellow')">
            <Lottie :src="'LookDownDark2.json'" :mode="'click'" style="width:30px;opacity: 0.4;" :background="'transparent'"/>
          </div>
          <div class="color-box cursor-pointer" style="background-color: #55ff77;" @click="setColor('green')">
            <Lottie :src="'LookDownDark2.json'" :mode="'click'" style="width:30px;opacity: 0.4  ;" :background="'transparent'"/>
          </div>
          <div class="color-box cursor-pointer" style="background-color: #5555ff;" @click="setColor('blue')">
            <Lottie :src="'LookDown2.json'" :mode="'click'" style="width:30px;opacity: 0.6;" :background="'transparent'"/>
          </div>
          <div class="color-box cursor-pointer" style="background-color: white;" @click="setColor('white')">
            <Lottie :src="'LookDownDark2.json'" :mode="'click'" style="width:30px;opacity: 0.4;" :background="'transparent'"/>
          </div>
          <div class="color-box cursor-pointer" style="background: linear-gradient(45deg, rgba(255,130,130,1) 7%, rgba(255,252,140,1) 31%, rgba(121,255,128,1) 50%, rgba(101,209,255,1) 69%, rgba(255,255,255,1) 93%);" @click="setColor('random')">
            <Lottie :src="'LookDownDark2.json'" :mode="'click'" style="width:30px;opacity: 0.4;" :background="'transparent'"/>
          </div>
          <div style="background-color: white;opacity:0.6;height:20px;width:4px;border-radius: 4px;margin:0px 5px">
            
          </div>
          <input @change="setLight($event.srcElement.value)" class="light-container transparent-border text f-small" style="width:40px;margin-left:5px;margin-right:2px" placeholder="LGT"/>
          <span class="text f-small">%</span>
        </div>
        <div class="flex-center" v-if="bottomPanelMode == 'battery'">
          <span style="margin:0px 10px" class="text f-medium f-bold">50%</span>
          
          <input class="light-container transparent-border text f-small" style="width:60px;margin-right:2px" placeholder="Max %"/>
          <span class="text f-small">%</span>
        </div>
        <div class="flex-center" v-if="bottomPanelMode == 'clock'">
          <span style="margin:0px 10px" class="text f-medium f-bold">{{currentTime}}</span>
        </div>


      </div>
    </div>
    
  </div>

  <div class="bottom-popup" :style="showPopup ? 'right: 20px;opacity:1' :'right:-1000px;opacity:0'">
    <component @confirm="handlePopupConfirm($event)" @close="closePopup();" :data="popupData" :is="popup"/>
  </div>

  <div class="bottom-encouragement flex-center" v-for="ec in encouragements" :key="ec.id">
    <div class="raised-container blur-bg" style="border-radius: 20px;padding:6px 14px" :class="getRandomFloatClass()">
      <span class="text f-large">{{ ec.text }}</span>
    </div>
    
  </div>

  <div style="position: absolute;" :style="showOverlay ? '' : 'display:none'">
    <div class="overlay-bg">

    </div>
    <div class="overlay">
      <SettingsOverlay @close="showOverlay = false" v-if="showOverlay && overlayToShow == 'settings'"/>
      <NoteOverlay @close="showOverlay = false" @save="handleSaveNoteOverlay($event.note, $event.mode)" :note="overlayData" v-if="showOverlay && overlayToShow == 'note'"/>
    </div>
  </div>
  
  
  
  
</template>

<script>


// main component is the schedule, it controls the layout of everything else
// various components are addons at different points around the rest of the screen
// they are given a priority that controls the size of the single component (which is controlled by the size of the schedule)




import CreateSchedule from "./components/CreateSchedule.vue";
import DeleteScheduleItem from "./components/DeleteScheduleItem.vue";

import { appWindow } from "@tauri-apps/api/window";
import { Command } from '@tauri-apps/api/shell';

import { writeTextFile, BaseDirectory, readTextFile, createDir } from '@tauri-apps/api/fs';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { sep } from '@tauri-apps/api/path';

export default {
  name: "App",
  data() {
    return {
      schedule: [
        
      ],
      loading: true,
      colors: ["red", "amber", "yellow", "green", "blue", "white"],
      popups: [CreateSchedule, DeleteScheduleItem],
      popup: CreateSchedule,
      showPopup: false,
      endOfToday: new Date().setHours(23,59,59,999),
      popupData: null,
      callbacks: {
        schedule: () => {}
      },
      encouragements: [],
      sizeMode: "schedule-top",
      showOverlay: false,
      overlayToShow: null,
      overlayData: null,
      bottomPanelMode: "leds",
      currentTime: ""
    }
  },
  methods: {
    quitApp(){
      setTimeout(() => {
        appWindow.close();
      }, 500);
      
    },
    
    setSizeMode(mode){
      this.sizeMode = mode;

      this.callbacks.checklist({
        event: 'viewMode',
        data: mode
      })
    },
    generateId(){
            return Math.random().toString(36).substr(2, 9);
        
        },
    openOverlay(overlayName, data){
      this.overlayToShow = overlayName;
      this.overlayData = data;
      this.showOverlay = true;
      
    
    },
    handleSaveNoteOverlay(note, mode){

      this.showOverlay = false;
      if(mode == 'edit'){
        this.callbacks.notes("editNote", note);
      }else if(mode == 'create'){
        this.callbacks.notes("createNote", note);
      }
      else if(mode == 'delete'){
        this.callbacks.notes("deleteNote", note);
      }
    },
    addEncouragement(text){
      var id = this.generateId();
      this.encouragements.push({
        text: text,
        id: id
      });
      setTimeout(() => {
        this.encouragements = this.encouragements.filter((e) => {
          return e.id != id;
        });
      }, 1400);
    },
    getRandomFloatClass(){
      // get either anim-randomFloat1, anim-randomFloat2, or anim-randomFloat3
      var num = Math.floor(Math.random() * 3) + 1;
      return "anim-randomFloat" + num;
    },
    setCB(name, cb){
      this.callbacks[name] = cb;
    },
    handlePopupConfirm(e){
      if(e.type == 'create'){
        this.callbacks.schedule('createEvent', e.data);
      }else if(e.type == 'deleteOne'){
        this.callbacks.schedule('deleteOneEvent', e.data);
      }
      else if(e.type == 'deleteAll'){
        this.callbacks.schedule('deleteAllEvents', e.data);
      }
    },
    minimizeApp(){
      setTimeout(() => {
        appWindow.minimize();
      }, 500);
      
    },
    async setColor(color){

      if(color == 'random'){
        var c1 = this.colors[Math.floor(Math.random() * this.colors.length)];
        var c2 = this.colors[Math.floor(Math.random() * this.colors.length)];
        var c3 = this.colors[Math.floor(Math.random() * this.colors.length)];

        await new Command('led', ["led", "power", c1]).execute();
        await new Command('led', ["led", "right", c2]).execute();
        await new Command('led', ["led", "left", c3]).execute();
        return;
      }

      await new Command('led', ["led", "power", color == "blue" ? "white" : color]).execute();
      await new Command('led', ["led", "right", color]).execute();
      await new Command('led', ["led", "left", color]).execute();
    },
    async setLight(percent){
      if(percent == '' || percent == null || percent == undefined){
        percent = 0;
      }
      await new Command('led', ["pwmsetkblight", percent.toString()]).execute();
      
    },
    openPopup(index){

      if(this.showPopup){
        this.closePopup();
        setTimeout(() => {
          this.openPopup(index);
        }, 500);
        
        return;
      }

      this.popup = this.popups[index];
      setTimeout(() => {
        this.showPopup = true;
      }, 100);
      
    },
    openPopupWithData(index, data){

      if(this.showPopup){
        this.closePopup();
        setTimeout(() => {
          this.openPopupWithData(index, data);
        }, 500);
        
        return;
      }


      this.popupData = data;
      this.openPopup(index);
    },
    closePopup(){
      this.showPopup = false;
      
      setTimeout(() => {this.popup = null;this.popupData = null;}, 500);
    }
  },
  mounted(){

    setInterval(() => {
      this.bottomPanelMode = this.$store.getters.getSettingValue("panel_mode") == undefined ? "leds" : this.$store.getters.getSettingValue("panel_mode");
    }, 2000);

    setTimeout(async () => {
      try{
        await createDir("com.robosmrt.bonk",{
          dir: BaseDirectory.Data,
          recursive: true
        });
      }
      catch(e){

      }
      

      await this.$store.dispatch("loadSettings");
      await this.$store.dispatch("loadCache", "canvas");
      
      
      this.loading = false;
      await this.$store.dispatch("canvas_updateCache");
    }, 100);
    setTimeout(async () => {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        this.$store.state.notifPermission = permission === 'granted';
      }
    }, 100);

    setInterval(() => {
      // format as HH:MM AM/PM
      this.currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }, 1000);
    




  }
}
</script>


