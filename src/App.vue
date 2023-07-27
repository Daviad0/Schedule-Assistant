<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";
</script>

<template>
  <div class="top-bar flex-apart light-container" data-tauri-drag-region>
    <div>
      <span class="text f-large f-bold" style="margin-left:20px">Welcome</span>

    </div>
    <div class="flex-center">
      <Lottie @click="minimizeApp()" :src="'Minimize2.json'" :mode="'click'" style="width:60px" :background="'transparent'"/>
      <Lottie @click="quitApp()" :src="'Cancel.json'" :mode="'click'" style="width:60px" :background="'transparent'"/>

    </div>
    
  </div>
  <div style="margin-top:10px">
    <div class="flex-center" style="overflow-y:hidden" :style="loading ? 'max-height:100vh' : 'max-height:0px'">
      <Lottie :src="'Loading.json'" :mode="'loop'" style="width:200px;margin-top:10px;opacity:0.6" :background="'transparent'"/>
      
    </div>
    <div class="flex-apart" style="overflow-y:hidden;overflow-x:hidden;margin:0px 20px" :style="!loading ? 'max-height:100vh' : 'max-height:0px'">

      <div style="width:50%;border-radius: 16px;">
        <div class="flex-apart" style="margin:0px 20px;margin-bottom:10px">
          <span class="text f-large f-bold" style="margin-top:10px">Schedule</span>
          <Lottie :src="'Calendar.json'" :mode="'loop'" style="width:60px;margin-top:10px" :background="'transparent'"/>
          <div style="position:relative">
            <Lottie :src="'KeyHold.json'" :key="'n'" :speed="1.5" :mode="'keyhold'" style="width:40px;margin-top:10px" :background="'transparent'"/>
            <div style="position: absolute;top:10px;left:0;width:40px;height:40px" class="flex-center">
              <span class="text-dark f-small f-bold">N</span>
            </div>
          </div>
          
        </div>
        <div class="flex-center" style="flex-wrap: wrap;">
          <ScheduleItem style="margin:5px" v-for="item in schedule" :data="item"/>
        </div>
        
      </div>
      <div style="width:30%;border-radius: 16px;">
        <div class="flex-center" style="margin:0px 5px;margin-bottom: 10px;">
          <input class="raised-container transparent-border text f-medium" style="text-align: left;width:100%" placeholder="Add To-Do Item"/>
          <Lottie :src="'AddDown2.json'" :mode="'click'" style="width:30px;margin-left:15px" :background="'transparent'"/>
        </div>  
        <div>
          <div class="flex-apart">
            <span class="text f-medium" style="margin-top:10px">Do this thing!</span>
            <Lottie :src="'Checkbox2.json'" :mode="'toggle'" style="width:30px;margin-top:10px" :background="'transparent'"/>
          </div>
          
        </div>
        
      </div>
      
    </div>
    
  </div>

  <div class="bottom-menu">
    <div class="flex-center" style="justify-content: left;">
      <div class="raised-container flex-center">
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
        <input @change="setLight($event.srcElement.value)" class="raised-container transparent-border text f-small" style="width:40px;margin-left:5px;margin-right:2px" placeholder="LGT"/>
        <span class="text f-small">%</span>


      </div>
    </div>
    
  </div>
  
  
  
</template>

<script>

import { appWindow } from "@tauri-apps/api/window";
import { Command } from '@tauri-apps/api/shell';



export default {
  name: "App",
  data() {
    return {
      schedule: [
        {
          title: "UN1015",
          description: "This is a required class",
          timeEnd: new Date('7/27/2023 23:56:20'),
          timeStart: new Date('7/27/2023 15:53:00')
        },
        {
          title: "UN1016",
          description: "This is a required class",
          timeEnd: new Date(),
          timeStart: new Date()
        }
      ],
      loading: true,
      colors: ["red", "amber", "yellow", "green", "blue", "white"]
    }
  },
  methods: {
    quitApp(){
      setTimeout(() => {
        appWindow.close();
      }, 500);
      
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

      await new Command('led', ["led", "power", color]).execute();
      await new Command('led', ["led", "right", color]).execute();
      await new Command('led', ["led", "left", color]).execute();
    },
    async setLight(percent){
      if(percent == '' || percent == null || percent == undefined){
        percent = 0;
      }
      await new Command('led', ["pwmsetkblight", percent.toString()]).execute();
      
    }
  },
  mounted(){
    setTimeout(() => {
      this.loading = false;
    }, 1000)
  }
}
</script>


