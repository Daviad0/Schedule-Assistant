<template>
    <div class="raised-container" style="width:300px;overflow:hidden" :style="closing ? 'margin:0px;max-width:0px;max-height:0px;padding:0px' : 'padding:10px;max-width:300px;max-height:500px'" :class="isActive ? 'solid-border' : 'transparent-border'">
        <div class="flex-apart">
            <div style="margin-left:10px">
                <span class="text f-medium f-bold">{{data.title}}</span>
            </div>
            <div :class="isActive ? 'highlight-container' : 'solid-highlight-container'">
                <span class="text f-small" v-if="isActive">Until {{ formatDate(data.timeEnd) }}</span>
                <span class="text f-small" v-if="!isActive">{{ formatDate(data.timeStart) }} - {{ formatDate(data.timeEnd) }}</span>
            </div>
            
        </div>
        <div style="margin:10px">
            <span class="text f-small"><i>{{data.description}}</i></span>
        </div>
        <div class="flex-apart">
            <div class="flex-center">
                <Tag :name="'Class'"/>
            </div>
            <div class="flex-center" style="margin-right:5px">
                <Lottie :src="'Edit.json'" :mode="'hover'" :loop="true" :background="'transparent'" style="width:20px;transform:rotate(45deg);margin:5px" />
                <Lottie :src="'Snooze.json'" :mode="'hover'" :loop="true" :background="'transparent'" style="width:40px;margin:5px" />
            </div>
            
        </div>
        
    </div>
</template>
<script>
export default {
    name: "ScheduleItem",
    props: {
        data: Object
    },
    data() {
        return {
            isActive: false,
            closing: false
        }
    },
    methods: {
        formatDate(date){
            // return in HH:MM AM/PM format without date
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        },
        checkIfActive(){
            if(this.data.timeEnd > new Date() && this.data.timeStart < new Date()){
                this.isActive = true;
            }
            else{
                if(this.data.timeEnd < new Date()){
                    this.closing = true;
                }
                this.isActive = false;
            }
        }
    },
    mounted(){
        this.checkIfActive();
        setInterval(this.checkIfActive, 1000);
    },
    
    computed: {
        
    },
}
</script>