import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
//import store from "./store.js";
import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/api/fs';

import Vuex from 'vuex';


import { http } from '@tauri-apps/api'


const store = new Vuex.Store({
    state: {
        settings: {},
        cache: {},
        gottenFromSave: false,
        notifPermission: false
    },
    mutations: {
        setSettingValue(state, { id, value }) {
            this.state.settings[id] = value;
            
            this.dispatch("saveSettings");
        }
    },
    actions: {
        async loadSettings(state) {
            
            console.log("Loading settings");
            try{
                var json = await readTextFile('settings.json', { dir: BaseDirectory.AppData });
                this.state.settings = JSON.parse(json);
            }catch(e){
                console.log(e);
            }

            this.state.gottenFromSave = true;

        },
        async loadCache({state}, cache){
            console.log(cache)
            try{
                var json = await readTextFile('cache_' + cache + '.json', { dir: BaseDirectory.AppData });
                this.state.cache[cache] = JSON.parse(json);
            }catch(e){
                this.state.cache[cache] = {};
                console.log(e);
            }

        },
        async saveCache({state}, cache){
            var json = JSON.stringify(this.state.cache[cache]);
            await writeTextFile('cache_' + cache + '.json', json, { dir: BaseDirectory.AppData });
        },
        async saveSettings() {
            console.log("Saving settings");
            var json = JSON.stringify(this.state.settings);
            await writeTextFile('settings.json', json, { dir: BaseDirectory.AppData });
        },
        async canvas_getUserID(){
            var baseUrl = this.state.settings.canvas_url;
            var token = this.state.settings.canvas_token;
            console.log("CANVAS");

            if(baseUrl == "" || token == ""){
                this.state.settings.canvas_uid = "";
                return;
            }
            if(!baseUrl.toLowerCase().includes("http")){
                baseUrl = "https://" + baseUrl;
            }

            var res = await http.fetch(baseUrl + "/api/v1/users/self", {
                method: "GET",
                headers: { Authorization: "Bearer " + token }
            });
            console.log(res.data);

            if(res.data.errors) return;

            

            this.state.settings.canvas_uid = res.data.id;


            this.dispatch("canvas_updateCache");
            this.dispatch("saveSettings");

        },
        async canvas_updateCache(){
            
            await this.dispatch("canvas_getTodo");
            await this.dispatch("canvas_getEnrollments");
            await this.dispatch("canvas_getStream");

            
            await this.dispatch("saveCache", "canvas");
            

            this.state.cache["canvas"].lastUpdated = new Date();
            console.log(this.state.cache["canvas"]);
        },
        async canvas_getTodo(){

            var baseUrl = this.state.settings.canvas_url;
            var token = this.state.settings.canvas_token;
            var uid = this.state.settings.canvas_uid;
            if(!baseUrl.toLowerCase().includes("http")){
                baseUrl = "https://" + baseUrl;
            }

            
            var res = await http.fetch(baseUrl + "/api/v1/users/self/todo", {
                method: "GET",
                headers: { Authorization: "Bearer " + token }
            });

            this.state.cache["canvas"].todo = res.data;




        },
        async canvas_getEnrollments() {
            var baseUrl = this.state.settings.canvas_url;
            var token = this.state.settings.canvas_token;
            var uid = this.state.settings.canvas_uid;
            if(!baseUrl.toLowerCase().includes("http")){
                baseUrl = "https://" + baseUrl;
            }

            var res = await http.fetch(baseUrl + "/api/v1/users/" + uid + "/courses?include=total_scores", {
                method: "GET",
                headers: { Authorization: "Bearer " + token }
            });

            if(res.data.errors) return;

            for(var cI = 0; cI < res.data.length; cI++){
                var e = res.data[cI];
                if(e.enrollments.length == 0) return;

                var enrollInformation = e.enrollments[0];

                e.extraData = enrollInformation;
                e.enrollments = undefined;

                var assignRes = await http.fetch(baseUrl + "/api/v1/users/" + uid + "/courses/" + e.id + "/assignments?bucket=unsubmitted", {
                    method: "GET",
                    headers: { Authorization: "Bearer " + token }
                });

                if(assignRes.data.errors) return;

                e.assignments = assignRes.data;

               


                // if(courseInfo.data.errors) return;

                // e.name = courseInfo.data.name;
            

            
            }
            this.state.cache["canvas"].enrollments = res.data;
            
                
            
        },
        async canvas_getStream(){
            var baseUrl = this.state.settings.canvas_url;
            var token = this.state.settings.canvas_token;
            var uid = this.state.settings.canvas_uid;
            if(!baseUrl.toLowerCase().includes("http")){
                baseUrl = "https://" + baseUrl;
            }

            var res = await http.fetch(baseUrl + "/api/v1/users/self/activity_stream?only_active_courses=true", {
                method: "GET",
                headers: { Authorization: "Bearer " + token }
            });

            if(res.data.errors) return;

            this.state.cache["canvas"].stream = res.data;
        }
    },
    getters: {
        getSettingValue: (state) => (id) => {
            
            return state.settings[id];
        },
        getCache: (state) => (cache) => {
            return state.cache[cache];
        }
    }
});

import Lottie from "./components/Lottie.vue";
import ScheduleItem from "./components/ScheduleItem.vue";
import Tag from "./components/Tag.vue";
import CreateSchedule from "./components/CreateSchedule.vue";
import DeleteScheduleItem from "./components/DeleteScheduleItem.vue";
import Dropdown from "./components/Dropdown.vue";
import ButtonGroup from "./components/ButtonGroup.vue";
import Schedule from "./components/Schedule.vue";
import Checklist from "./components/Checklist.vue";
import ChecklistItem from "./components/ChecklistItem.vue";
import AutoInput from "./components/AutoInput.vue";
import SettingsOverlay from "./components/SettingsOverlay.vue";
import Notes from "./components/Notes.vue";
import Canvas from "./components/Canvas.vue";
import MultiDropdown from "./components/MultiDropdown.vue";
import NoteOverlay from "./components/NoteOverlay.vue";


const app = createApp(App)

//app.use(store);

app.use(store);

app.component("Lottie", Lottie);
app.component("ScheduleItem", ScheduleItem);
app.component("Tag", Tag);
app.component("CreateSchedule", CreateSchedule);
app.component("Dropdown", Dropdown);
app.component("ButtonGroup", ButtonGroup);
app.component("DeleteScheduleItem", DeleteScheduleItem);
app.component("Schedule", Schedule);
app.component("Checklist", Checklist);
app.component("ChecklistItem", ChecklistItem);
app.component("AutoInput", AutoInput);
app.component("SettingsOverlay", SettingsOverlay);
app.component("Notes", Notes)
app.component("Canvas", Canvas);
app.component("MultiDropdown", MultiDropdown);
app.component("NoteOverlay", NoteOverlay);
app.mount("#app")

