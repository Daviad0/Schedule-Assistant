<template>
    <div class="raised-container" v-if="size == 'regular'" style="overflow:hidden" :style="closing ? 'margin:0px;max-width:0px;max-height:0px;padding:0px;min-width:0px;border:0px solid transparent' : 'padding:10px;min-width:100px;max-width:500px;max-height:500px;margin:5px'" :class="isActive ? 'solid-border' : 'transparent-border'">
        <div class="flex-apart">
            <div style="margin-left:10px;margin-right:10px">
                <span class="text f-medium f-bold" :style="wrap == true ? '' : 'white-space: nowrap;'">{{data.title}}</span>
            </div>
            <div :class="isActive ? 'highlight-container' : 'solid-highlight-container'">
                <span class="text f-small" :style="wrap == true ? '' : 'white-space: nowrap;'" v-if="isActive">Until {{ formatDate(data.endTime) }}</span>
                <span class="text f-small" :style="wrap == true ? '' : 'white-space: nowrap;'" v-if="!isActive">{{ formatDate(data.startTime) }} - {{ formatDate(data.endTime) }}</span>
            </div>
            
        </div>
        <div style="margin:10px">
            <span class="text f-small"><i>{{data.description}}</i></span>
        </div>
        <div class="flex-apart">
            <div class="flex-center">
                <Tag :name="'Class'"/>
            </div>
            <div class="flex-center" style="margin-right:5px" v-if="!finished">
                <Lottie :src="'Edit.json'" :mode="'hover'" :loop="true" :background="'transparent'" style="width:20px;transform:rotate(45deg);margin:5px" @click="emitScheduleItemChange('edit')" />
                <Lottie :src="'Trash.json'" :speed="0.5" :mode="'hover'" :loop="true" :background="'transparent'" style="width:40px;margin:5px;margin-right:0px" @click="emitScheduleItemChange('delete')" />
                <Lottie :src="'Snooze.json'" :mode="'hover'" :loop="true" :background="'transparent'" style="width:40px;margin:5px" />
            </div>
            <div class="flex-center" style="margin-right:5px" v-if="finished">
                <Lottie :src="'Finished.json'" :speed="0.5" :mode="'hover'" :loop="true" :background="'transparent'" style="width:30px;margin:5px;margin-right:0px" @click="emitScheduleItemChange('delete')" />
            </div>

            
        </div>
        
    </div>
    <div class="raised-container" v-if="size == 'small'" style="overflow:hidden" :style="closing ? 'margin:0px;max-width:0px;max-height:0px;padding:0px;min-width:0px;border:0px solid transparent' : 'padding:10px;min-width:100px;max-width:500px;max-height:500px;margin:5px;margin-top:10px'" :class="isActive ? 'solid-border' : 'transparent-border'">
        <div class="flex-center" style="margin-top:5px">
            
            <div>
                <span class="text f-small f-bold" style="white-space:break-spaces;">{{data.title}}</span>
            </div>
        </div>
        <div class="flex-center" style="margin-top:5px">
            <div :class="isActive ? 'highlight-container' : 'solid-highlight-container'">
                <span class="text f-small" :style="wrap == true ? '' : 'white-space: nowrap;'" v-if="isActive">Until {{ formatDate(data.endTime) }}</span>
                <span class="text f-small" :style="wrap == true ? '' : 'white-space: nowrap;'" v-if="!isActive">{{ formatDate(data.startTime) }} - {{ formatDate(data.endTime) }}</span>
            </div>
        </div>
        <div style="margin-top:10px">
            <span class="text f-tiny" style="white-space:normal;"><i>{{data.description}}</i></span>
        </div>
        <div class="flex-center" style="margin-left:5px" v-if="!finished">
                <Lottie :src="'Edit.json'" :mode="'hover'" :loop="true" :background="'transparent'" style="width:20px;transform:rotate(45deg);margin:5px" @click="emitScheduleItemChange('edit')" />
                <Lottie :src="'Trash.json'" :speed="0.5" :mode="'hover'" :loop="true" :background="'transparent'" style="width:40px;margin:5px;margin-right:0px" @click="emitScheduleItemChange('delete')" />
                <Lottie :src="'Snooze.json'" v-if="this.$store.getters.getSettingValue('sched_snooze_item_mode') != 'disable'" :mode="'hover'" :loop="true" :background="'transparent'" style="overflow-y:hidden" :style="isActive ? 'width:40px;margin:5px' : 'width:0px;margin:0px'" />
            </div>
            <div class="flex-center" style="margin-right:5px;margin-top:5px" v-if="finished">
                <Lottie :src="'Finished.json'" :speed="0.5" :mode="'hover'" :loop="true" :background="'transparent'" style="width:30px;margin:5px;margin-right:0px" @click="emitScheduleItemChange('delete')" />
            </div>
        
    </div>
</template>
<script>
export default {
    name: "ScheduleItem",
    props: {
        data: Object,
        wrap: Boolean,
        size: String
    },
    data() {
        return {
            isActive: false,
            closing: false,
            finished: false,
            deleted: false
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

            

            if(this.data.endTime > new Date() && this.data.startTime < new Date()){
                this.isActive = true;
            }
            else{
                if(this.data.endTime < new Date() && this.size != 'small'){
                    this.closing = true;
                }
                if(this.data.endTime < new Date()){
                    this.finished = true;
                }
                this.isActive = false;
            }

            if(this.data.deleted){
                this.closing = true;
                this.isActive = false;
            }




            if(this.closing == true && this.deleted == false){
                setTimeout(() => {
                    this.$emit("remove", this.data);
                    this.deleted = true;
                }, 1000);
            }

        },
        emitScheduleItemChange(type){
            this.$emit("event", {
                event: type,
                data: this.data
            });
        }
    },
    mounted(){

        if(this.data.created){
            this.closing = true;
            setTimeout(() => {
                    this.emitScheduleItemChange("noLongerNew");
                    this.data.created = false;
                    this.closing = false;
                }, 500);
        }

        this.checkIfActive();
        setInterval(this.checkIfActive, 1000);
    },
    
    computed: {
        
    },
}
</script>