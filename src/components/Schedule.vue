<template>
    <div style="margin:20px;padding:10px;border-radius: 16px;padding-bottom: 30px;overflow-y:scroll" class="dashed-border">
        <div class="flex-apart" style="margin:0px 20px;margin-bottom:10px">
            <div class="flex-center">
                <Lottie @click="openPopup(0, undefined)" :src="'Calendar.json'" :mode="'loop'" style="width:60px;margin-top:10px" :background="'transparent'"/>
                <span class="text f-large f-bold" style="margin-top:10px">Schedule</span>
                
            </div>
          
          <ButtonGroup @change="setView($event)" :buttons="['Today', 'Week']"/>
          <!--<div style="position:relative">
            <Lottie @keyhold="" :src="'KeyHold.json'" :key="'n'" :speed="1.5" :mode="'keyhold'" style="width:40px;margin-top:10px" :background="'transparent'"/>
            <div style="position: absolute;top:10px;left:0;width:40px;height:40px" class="flex-center">
              <span class="text-dark f-small f-bold">N</span>
            </div>
          </div>-->
          
        </div>
        <div class="flex-center">
            <div style="border-radius: 16px;overflow:hidden;white-space: nowrap;" :style="viewType == 'day' ? 'max-height:100vh;opacity:1' : 'max-height:0vh;opacity:0'">
        
        <div class="flex-center" style="flex-wrap: wrap;justify-content: left;align-items: start;">
          <ScheduleItem @remove="completelyRemoveScheduleItem($event)" :size="'regular'" @event="scheduleItemEvent($event)" v-for="item in schedule.filter(s => s.startTime < this.endOfToday)" :key="item.id" :data="item"/>
        </div>
        
      </div>
        </div>
  
      <div class="flex-center">
        <div style="border-radius: 16px;overflow:hidden;white-space: nowrap;" :style="viewType == 'week' ? 'max-height:100vh;opacity:1' : 'max-height:0vh;opacity:0'">
        
        <div class="flex-center" style="flex-wrap: wrap;justify-content: left;align-items: start;">
            <div v-for="dayOfWeek in [0,1,2,3,4,5,6]" style="width:260px;padding-top:10px">
                <span class="text f-medium f-bold">{{ days[dayOfWeek] }}</span>
                <div style="margin-top:10px">
                    <ScheduleItem @remove="completelyRemoveScheduleItem($event)" :size="'small'" @event="scheduleItemEvent($event)" :wrap="true" v-for="item in getEventsOnDay(dayOfWeek)" style="max-width: 100%;" :key="item.id" :data="item"/>
                </div>
                
            </div>
          
        </div>
        
      </div>
    </div>  
      </div>
    
    
</template>
<script>
import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
export default {
    name: "Schedule",
    data() {
        return {
            schedule: [],
            viewType: 'week',
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            endOfToday: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999),
            endOfWeek: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7-new Date().getDay()), 23, 59, 59, 999)
        }
    },
    methods: {
        openPopup(type, data){
            this.$emit("popup", {
                type: type,
                data: data
            });
        },
        setView(view){
            if(view == "Today"){
                this.viewType = "day";
                this.$emit("setsizemode", "schedule-side");
            }
            else if(view == "Week"){
                this.viewType = "week";
                this.$emit("setsizemode", "schedule-top");
            }

            
           
        },
        scheduleItemEvent(event){
            if(event.event == "edit"){
                this.openPopup(0, event.data);
            }
            else if(event.event == "delete"){
                this.openPopup(1, event.data);
            }
            else if(event.event == "noLongerNew"){
                this.schedule.forEach(e => {
                    if(e.startTime == event.data.startTime && e.id == event.data.id){
                        e.created = false;
                    }
                });
                this.saveSchedule();
            }
        },
        createScheduleObject(obj){

            obj.created = true;

            this.schedule.push(obj);
            this.saveSchedule();
        },
        completelyRemoveScheduleItem(obj){
            //this.schedule = this.schedule.filter(e => e.startTime != obj.startTime && e.id != obj.id);
            this.saveSchedule();
        },
        deleteScheduleItem(obj){


            this.schedule.forEach(e => {
                if(e.startTime == obj.startTime && e.id == obj.id){
                    e.deleted = true;
                }
            });

            //this.schedule = this.schedule.filter(e => e.startTime != obj.startTime && e.id != obj.id);
            this.saveSchedule();
        },
        deleteAllScheduleItems(obj){

            this.schedule.forEach(e => {
                if(e.id == obj.id){
                    e.deleted = true;
                }
            });

            //this.schedule = this.schedule.filter(e => e.id != obj.id);
            this.saveSchedule();
        },
        async saveSchedule(){
            await writeTextFile('schedule.json', JSON.stringify(this.schedule), { dir: BaseDirectory.AppData });
        },
        async readSchedule(){
            var objects = [];
            try{
                var schedule = await readTextFile('schedule.json', { dir: BaseDirectory.AppData });
                objects = JSON.parse(schedule);
            }catch(e){
                console.log(e);
            }

            console.log(objects);
            
            var finalSchedule = [];
            objects.forEach(e => {
                e.startTime = new Date(e.startTime);
                e.endTime = new Date(e.endTime);

                finalSchedule.push(e);
            })

            this.schedule = finalSchedule.sort((a, b) => a.startTime - b.startTime);

            console.log(this.schedule)
            
        },
        handleEventsFromAbove(name, data){
            if(name == 'createEvent'){
                this.createScheduleObject(data);
            }else if(name == 'deleteOneEvent'){
                this.deleteScheduleItem(data);
            }else if(name == 'deleteAllEvents'){
                this.deleteAllScheduleItems(data);
            }
        },
        getEventsOnDay(dayOfWeek){
            var events = [];
            this.schedule.forEach(e => {
                // check if the event is on day of week and is on THIS WEEK 
                if(e.startTime.getDay() == dayOfWeek && e.startTime < this.endOfWeek){
                    events.push(e);
                }
            });

            return events;
        }
    },
    mounted() {
        this.readSchedule();

        setInterval(() => {
            this.endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999);
            this.endOfWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7-new Date().getDay()), 23, 59, 59, 999);
        }, 20000);

        this.$emit("setcb", this.handleEventsFromAbove);


    }
}
</script>