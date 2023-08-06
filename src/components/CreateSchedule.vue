<template>
    <div class="raised-container" style="width:500px">


        


        <div class="flex-apart" style="margin:15px 10px">
            <span class="text f-medium f-bold">Create Schedule Item</span>
            <div class="flex-center">
                <Lottie @click="createEvent()" :style="validToCreate ? 'opacity: 1' : 'opacity:0'"  :src="'Checkmark2.json'" :mode="'click'" :background="'transparent'" style="width:40px"/>
                <Lottie @click="closePopup()"  :src="'Cancel.json'" :mode="'click'" :background="'transparent'" style="width:40px"/>
            </div>
            
        </div>
        <div class="flex-apart" style="margin:10px 5px">
            <div style="width:50%">
                <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px">Event Title</span>
                <input @change="updateEventDetails('title', $event.srcElement.value)" class="light-container transparent-border text f-medium" style="text-align: left" placeholder="Really Cool Class"/>
            </div>
            
            <div class="flex-center" style="width:50%">
                <div style="width:40%;margin:0px 5px">
                    <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px">Start</span>
                    <input ref="startTime" @change="updateEventDetails('startTime', $event.srcElement.value)" class="light-container transparent-border text f-small" style="text-align: left;padding:8px 10px" type="time" placeholder="From"/>
                </div>
                
                <div style="width:40%;margin:0px 5px">
                    <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px">End</span>
                    <input ref="endTime" @change="updateEventDetails('endTime', $event.srcElement.value)" class="light-container transparent-border text f-small" style="text-align: left;padding:8px 10px" type="time" placeholder="To"/>
                </div>
            </div>
            
        </div>
        <div class="flex-apart" style="margin:5px">
            <div style="width:40%">
                <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px">Schedule As</span>
                <Dropdown :options="['Single Event', 'Recurring Event']" @change="updateEventMode($event)" :optionids="['single', 'recurring']" :placeholder="'Event Type'"/>
            </div>
            <div style="width:55%;overflow-x: hidden;" class="flex-center">
                <div :style="this.eventMode == 'single' ? 'max-width:100%;max-height:100%;opacity:1' : 'max-width:0px;max-height:0px;opacity:0'" style="overflow:hidden">
                    <div>
                        <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Event Date</span>
                        <input ref="startDateSingle" @change="updateEventDetails('startDate', $event.srcElement.value)" class="light-container transparent-border text f-small" style="text-align: left;padding:8px 10px" placeholder="Date" type="date"/>
                    </div>
                </div>
                <div :style="this.eventMode == 'recurring' ? 'max-width:100%;max-height:100%;opacity:1' : 'max-width:0px;max-height:0px;opacity:0'" class="flex-center"  style="overflow-x:hidden">
                    <div style="width:50%;margin-right:5px">
                        <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Start Date</span>
                        <input ref="startDate" @change="updateEventDetails('startDate', $event.srcElement.value)" class="light-container transparent-border text f-small" style="text-align: left;padding:8px 10px" placeholder="Date" type="date"/>
                    </div>
                    <div style="width:50%;margin-left:5px">
                        <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">End Date</span>
                        <input ref="endDate" @change="updateEventDetails('endDate', $event.srcElement.value)" class="light-container transparent-border text f-small" style="text-align: left;padding:8px 10px" placeholder="Date" type="date"/>
                    </div>
                </div>
            </div>
            
            
            
            
            
        </div>
        <div :style="this.eventMode == 'recurring' ? 'max-width:100%;max-height:100%;opacity:1;margin:10px' : 'max-width:0px;max-height:0px;opacity:0;margin:0px'" class="flex-center"  style="overflow:hidden">
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(0) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(0)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">S</div>
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(1) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(1)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">M</div>
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(2) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(2)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">T</div>
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(3) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(3)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">W</div>
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(4) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(4)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">T</div>
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(5) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(5)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">F</div>
            <div class="light-container flex-center text f-medium f-bold cursor-pointer hover-big" :class="daysOfWeekSelected.includes(6) ? 'solid-border' : 'transparent-border'" @click="selectDayOfWeek(6)" style="width:20px;height:20px;border-radius: 40px;margin:10px 5px">S</div>
        </div>
        <div style="margin:5px">
            <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Description</span>
            <textarea class="light-container transparent-border text f-small" @change="updateEventDetails('description', $event.srcElement.value)" style="resize: none;width: 95%;height:80px"></textarea>
        </div>
        
    </div>
</template>
<script>
export default {
    name: "CreateSchedule",
    props:{
        data:Object
    },
    data(){
        return {
            eventMode: "",
            daysOfWeekSelected: [],
            eventObject: {
                title: "",
                description: "",
                startTime: "",
                endTime: "",
                eventMode: "",
                startDate: "",
                endDate: "",
                daysOfWeek: []
            },
            validToCreate: false
        }
    },
    methods: {
        updateEventMode(mode){
            console.log(mode);
            this.eventMode = mode;
            this.updateEventDetails("eventMode", mode);
            this.updateEventDetails("startDate", "");
            this.updateEventDetails("endDate", "");

            this.$refs.startDate.value = "";
            this.$refs.startDateSingle.value = "";
            this.$refs.endDate.value = "";


        },
        selectDayOfWeek(day){
            if(this.daysOfWeekSelected.includes(day)){
                this.daysOfWeekSelected.splice(this.daysOfWeekSelected.indexOf(day), 1);
            }else{
                this.daysOfWeekSelected.push(day);
            }
            this.updateEventDetails("daysOfWeek", this.daysOfWeekSelected);
        },
        closePopup(){
            this.$emit('close');
        },
        generateId(){
            return Math.random().toString(36).substr(2, 9);
        
        },
        createEvent(){
            if(!this.validToCreate) return;



            if(this.eventObject['eventMode'] == 'single'){
                var newObject = {
                    title: this.eventObject['title'],
                    description: this.eventObject['description'],
                    startTime: new Date(this.eventObject['startDate'] + " " + this.eventObject['startTime']),
                    endTime: new Date(this.eventObject['startDate'] + " " + this.eventObject['endTime']),
                    id: this.generateId()
                }

                this.$emit('confirm', {data: newObject, type:'create'});

                this.closePopup();
                return;
            }

            var startDate = new Date(this.eventObject['startDate'] + " " + this.eventObject['startTime']);
            var endDate = new Date(this.eventObject['endDate'] + " " + this.eventObject['endTime']);
            var id = this.generateId();
            // loop through each day from start date to end date
            while(startDate <= endDate){
                // check if the day is selected
                if(this.eventObject['daysOfWeek'].includes(startDate.getDay())){
                    var newObject = {
                        title: this.eventObject['title'],
                        description: this.eventObject['description'],
                        startTime: new Date(startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " " + this.eventObject['startTime']),
                        endTime: new Date(startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " " + this.eventObject['endTime']),
                        recurringData: {
                            startDate: this.eventObject['startDate'],
                            endDate: this.eventObject['endDate'],
                            daysOfWeek: this.eventObject['daysOfWeek']
                        },
                        id: id
                    }

                    this.$emit('confirm', {data: newObject, type:'create'});
                }

                startDate.setDate(startDate.getDate() + 1);
            }
            this.closePopup();

            
        },
        updateEventDetails(key,val){
            this.eventObject[key] = val;

            console.log(this.eventObject);

            this.validToCreate = false;
            this.$refs.startDate.style.border = "";
            this.$refs.endDate.style.border = "";
            this.$refs.startTime.style.border = "";
            this.$refs.endTime.style.border = "";
            // now check if each field is valid

            if(new Date(this.eventObject["startDate"]) > new Date(this.eventObject["endDate"]) && this.eventObject["eventMode"] == "recurring"){
                this.$refs.startDate.style.border = "2px solid #ff0040";
                this.$refs.endDate.style.border = "2px solid #ff0040";
                return;
            }

            // check if start time is before end time
            if(new Date("1/1/1970 " + this.eventObject["startTime"]) > new Date("1/1/1970 " + this.eventObject["endTime"])){
                this.$refs.startTime.style.border = "2px solid #ff0040";
                this.$refs.endTime.style.border = "2px solid #ff0040";
                return;
            }


            if(this.eventObject["title"] == "") return;
            if(this.eventObject["startTime"] == "") return;
            if(this.eventObject["endTime"] == "") return;
            if(this.eventObject["eventMode"] == "") return;
            if(this.eventObject["startDate"] == "") return;
            if(this.eventObject["endDate"] == "" && this.eventObject["eventMode"] == "recurring") return;
            if(this.eventObject["daysOfWeek"].length == 0 && this.eventObject["eventMode"] == "recurring") return;

            
            this.validToCreate = true;


        },
        
    }
}
</script>