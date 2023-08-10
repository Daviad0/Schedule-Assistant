import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
//import store from "./store.js";
import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/api/fs';

import Vuex from 'vuex';


const store = new Vuex.Store({
    state: {
        settings: {},
        gottenFromSave: false
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
        async saveSettings() {
            console.log("Saving settings");
            var json = JSON.stringify(this.state.settings);
            await writeTextFile('settings.json', json, { dir: BaseDirectory.AppData });
        }
    },
    getters: {
        getSettingValue: (state) => (id) => {
            
            return state.settings[id];
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
app.mount("#app")

