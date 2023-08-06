<template>
    <div class="raised-container" style="width:500px">
        <div class="flex-apart" style="margin:15px 10px">
            <span class="text f-medium f-bold">Delete Schedule Item</span>
            <div class="flex-center">
                <Lottie @click="deleteEvent()" :style="deleteMode != '' ? 'opacity: 1' : 'opacity:0'"  :src="'Checkmark2.json'" :mode="'click'" :background="'transparent'" style="width:40px"/>
                <Lottie @click="closePopup()"  :src="'Cancel.json'" :mode="'click'" :background="'transparent'" style="width:40px"/>
            </div>
            
        </div>
        <div v-if="data.recurringData != undefined" style="margin:0px 10px">
            <ButtonGroup @change="changeDeleteMode($event)" :buttons="['Only This Event', 'All Future Occurances']"/>
        </div>
        <div class="solid-border empty-container" style="margin:15px 10px">
            <div class="flex-apart" style="margin:10px">
                <span class="text f-medium f-bold">{{ data.title }}</span>
                <span class="text f-medium">{{ formatDateTime(data.startTime) }} - {{ formatDateTime(data.endTime) }}</span>
            </div>
            
            <div class="flex-center" style="margin:10px">
                <span class="text f-small" v-if="this.deleteMode == 'Only This Event'"><i>Happening on {{ formatDateString(data.startTime) }}</i></span>
                <span class="text f-small" v-if="this.deleteMode == 'All Future Occurances' && data.recurringData != undefined"><i>Recurring on {{ formatMultiDays(data.recurringData.daysOfWeek) }} until {{ data.recurringData.endDate.toLocaleString() }}</i></span>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    name: "DeleteScheduleItem",
    props: {
        data: Object
    },
    data() {
        return {
            deleteMode: ""
        }
    },
    methods: {
        formatDateTime(date){
            // return in HH:MM AM/PM format without date
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        },
        formatDateString(date){
            var dateString = date.toDateString();

            return dateString.substring(0, dateString.length - 5);
        },
        changeDeleteMode(mode){
            this.deleteMode = mode;
        },
        formatMultiDays(days){
            var daysString = "";
            for(var i = 0; i < days.length; i++){
                daysString += days[i];
                if(i != days.length - 1){
                    daysString += ", ";
                }
            }
            return daysString;
        },
        deleteEvent(){
            if(this.deleteMode == '') return;
            if(this.deleteMode == "Only This Event"){
                this.$emit('confirm', {data: this.data, type:'deleteOne'});
            }else{
                this.$emit('confirm', {data: this.data, type:'deleteAll'});
            }

            this.$emit("close")
        },
        closePopup(){
            this.$emit("close");
        }
    },
    mounted(){
        if(this.data.recurringData == undefined){
            this.deleteMode = "Only This Event";
        }
        
    }
}
</script>