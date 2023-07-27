import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";

import Lottie from "./components/Lottie.vue";
import ScheduleItem from "./components/ScheduleItem.vue";
import Tag from "./components/Tag.vue";


const app = createApp(App)



app.component("Lottie", Lottie);
app.component("ScheduleItem", ScheduleItem);
app.component("Tag", Tag);
app.mount("#app")

