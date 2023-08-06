import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";

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


const app = createApp(App)



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
app.mount("#app")

