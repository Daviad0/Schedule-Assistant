<template>
    <div style="margin: 10px 20px;">
        <div class="flex-apart">
            <div style="width:100%">
                <div class="flex-center" :style="data.checkedAt != undefined ? 'opacity:0.7' : 'opacity:1'" style="justify-content: left;">
                    <span class="text f-medium f-bold" :style="data.checkedAt != undefined ? 'text-decoration: line-through;' : ''" style="text-align: left;margin-right:10px;">{{ data.name }}</span>
                    <Tag :name="data.category" v-if="data.category != ''"/>
                    
                    
                </div>  
                <div v-if="data.dueAt != undefined" style="justify-content: left;" class="flex-center" >
                    <div class="solid-highlight-container" style="overflow-x: hidden;margin-left:0px" :style="this.data.checkedAt != undefined ? 'max-width:100%;opacity:1;margin-right:10px;padding:4px 10px' : 'max-width:0px;opacity:0;margin-right:0px;padding:0px'" >
                        <span class="text f-small" style="white-space: nowrap;">Completed On {{ this.data.checkedAt == undefined ? getShortDateTimeCompleted(cacheCheckTime) : getShortDateTimeCompleted(this.data.checkedAt) }}</span>
                    </div>
                    <div class="bg-transparent" style="height:8px" :style="this.data.checkedAt == undefined ? 'width:80%;border-radius: 8px 0px 0px 8px;' : 'width:30%;border-radius: 8px;'">
                        <div :class="this.data.checkedAt == undefined ? 'bg-main' : 'bg-transparent'" style="height:8px;" :style="'width:' + (this.shorthandTimeLeft == 'Due' ? 100 : progressOfTime) + '%;' + (progressOfTime == 100 ? 'border-radius: 8px 0px 0px 8px;' : 'border-radius: 8px;')">
                            
                        </div>
                    </div>
                    <div :class="progressOfTime == 100 || this.shorthandTimeLeft == 'Due' ? 'highlight-container' : 'solid-highlight-container'" style="margin-left:0px;overflow-x: hidden;" :style="this.data.checkedAt == undefined ? 'max-width:100%;opacity:1' : 'max-width:0px;opacity:0'" >
                        <span class="text f-small">{{this.shorthandTimeLeft}}</span>
                    </div>

                </div>
                <div v-if="data.dueAt == undefined">

                </div>
            </div>
            
            <Lottie :toggledinit="shouldBeChecked" :key="shouldBeChecked" @toggle="setChecklistItemStatus($event)" :src="'Checkbox2.json'" :mode="'toggle'" style="width:30px;margin-left:15px" :style="data.checkedAt != undefined ? 'opacity: 0.7' : 'opacity:1'" :background="'transparent'"/>
        </div>
        
    </div>
</template>
<script>
export default {
    name: "ChecklistItem",
    props: {
        data: Object
    },
    data() {
        return {
            cacheCheckTime: undefined,
            shorthandTimeLeft: '',
            progressOfTime: 0,
            shouldBeChecked: false
        }
    },
    mounted(){
        if(this.data.dueAt != undefined){
            this.shorthandTimeLeft = this.getShorthandTimeLeft(this.data.dueAt, new Date());
            setInterval(() => {
                this.shorthandTimeLeft = this.getShorthandTimeLeft(this.data.dueAt, new Date());
                if(this.data.checkedAt != undefined){
                    this.progressOfTime = this.getProgressOfTime(this.data.createdAt, this.data.dueAt, this.data.checkedAt);
                }else{
                    this.progressOfTime = this.getProgressOfTime(this.data.createdAt, this.data.dueAt, new Date());
                }
                

                console.log(this.progressOfTime, this.shorthandTimeLeft, this.data.dueAt)
            }, 1000);
            this.progressOfTime = this.getProgressOfTime(this.data.createdAt, this.data.dueAt, new Date());
            
        }

        setTimeout(() => {
            this.shouldBeChecked = this.data.checkedAt != undefined;
        }, 100);
        
    },
    methods: {
        getProgressOfTime(created, endAt, useTime){
            var now = useTime;
            var total = endAt.getTime() - created.getTime();
            var elapsed = now.getTime() - created.getTime();

            return Math.min((elapsed / total)*100,100);
        },
        getShorthandTimeLeft(endAt, checkAt){
            var now = checkAt;
            if(now > endAt){
                return "Due";
            }

            var total = endAt.getTime() - now.getTime();
            // if more than 48 hours, return number of days
            if(total > 1000*60*60*48){
                return Math.floor(total / (1000*60*60*24)) + "d";
            }
            // if more than 1 hour, return number of hours
            if(total > 1000*60*60){
                return Math.floor(total / (1000*60*60)) + "h";
            }
            // if more than 1 minute, return number of minutes
            if(total > 1000*60){
                return Math.floor(total / (1000*60)) + "m";
            }
            // return number of seconds
            return Math.floor(total / 1000) + "s";
        },
        getShortDateTimeCompleted(completed){
            if(completed == undefined){
                return "";
            }
            // return date in format MM/DD HH:MM AM/PM
            return (completed.getMonth()+1) + "/" + completed.getDate() + " @ " + (completed.getHours() > 12 ? completed.getHours() - 12 : completed.getHours()) + ":" + (completed.getMinutes() < 10 ? "0" : "") + completed.getMinutes() + " " + (completed.getHours() > 12 ? "PM" : "AM");
            
        },
        setChecklistItemStatus(toggled){
            if(toggled){
                this.data.checkedAt = new Date();

            }else{
                this.cacheCheckTime = this.data.checkedAt;
                this.data.checkedAt = undefined;
            }

            this.$emit('event', {
                event: 'checked',
                data: this.data
            });
        }
    }
}
</script>