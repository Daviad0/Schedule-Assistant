<template>
    <div style="margin:20px;height:100%" ref="base">
        <div style="height:100%;flex-direction: column;justify-content: start;" class="flex-center">
            <div style="width:100%">
                <div class="flex-center" style="margin:0px 5px;margin-bottom: 10px;">
                    <input v-on:keydown.enter="createItem()" @keyup="updateName($event.srcElement.value)" ref="name" class="raised-container transparent-border text f-medium" style="text-align: left;width:100%" placeholder="Add To-Do Item"/>
                    <Lottie @click="createItem()" :src="'AddDown2.json'" :mode="'click'" style="width:30px;margin-left:15px" :background="'transparent'"/>
                </div> 
                <div class="flex-apart" style="overflow-y: hidden" :style="showExtraDetails ? 'max-height:500px' : 'max-height:0px'">
                    <div style="width:30%;margin:0px 5px">
                        <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Use Tag</span>
                        <AutoInput ref="tag" :autofill="usedCategories" style="width:100%" :placeholder="'Work'"/>
                    </div>
                    <div style="width:60%;margin:0px 5px">
                        <span class="text f-small" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Due At</span>
                        <input ref="due" class="raised-container transparent-border text f-small" style="padding:8px 0px;width:100%" type="datetime-local"/>
                    </div>
                    
                    
                </div>
                
            </div>
             
            
            <div style="margin-top:20px;width:100%;height:100%">
                <div class="flex-center" style="align-items: start;height:100%" v-if="viewMode == 'schedule-top'">
                    <div style="width:50%;overflow-y:auto"  :style="showExtraDetails ? 'max-height:60%' : 'max-height:80%'">
                        <div v-for="item in highPriorityItems()">
                    
                            <ChecklistItem @event="handleChecklistItem($event)" :data="item"/>
                            
                            
                        </div>
                    </div>
                    <div style="width:50%;overflow-y:auto" :style="showExtraDetails ? 'max-height:60%' : 'max-height:80%'">
                        <div v-for="item in lowPriorityItems()">
                    
                            <ChecklistItem @event="handleChecklistItem($event)" :data="item"/>
                            
                            
                        </div>
                    </div>
                    
                </div>
                <div v-if="viewMode == 'schedule-side'" style="overflow-y:auto;" :style="showExtraDetails ? 'max-height:80%' : 'max-height:90%'">
                    <div v-for="item in highPriorityItems()" >
                    
                        <ChecklistItem @event="handleChecklistItem($event)" :data="item"/>
                        
                        
                    </div>
                    <div v-for="item in lowPriorityItems()" >
                    
                        <ChecklistItem @event="handleChecklistItem($event)" :data="item"/>
                        
                        
                    </div>
                </div>
                
                
            
            </div>
        
        </div>
    </div>
</template>
<script>
import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
export default {
    name: "Checklist",
    data(){
        return {
            items: [{
                name: "Do this thing!",
                checkedAt: undefined,
                createdAt: new Date('8/3/2023 16:00:00'),
                dueAt: new Date('8/3/2023 23:36:00'),
                category: "Work"
            }],
            showExtraDetails: false,
            usedCategories: [],
            viewMode: "schedule-side"
        }
    },
    methods: {
        updateName(text){
            this.showExtraDetails = text != "";
        },
        updateUsedCategories(){
            this.usedCategories = this.items.map(item => item.category).filter((value, index, self) => self.indexOf(value) === index);
        },
        createItem(){
            var name = this.$refs.name.value;
            var due = this.$refs.due.value;
            var tag = this.$refs.tag.value;

            if(name == ""){
                return;
            }
            
            var item = {
                name: name,
                checkedAt: undefined,
                createdAt: new Date(),
                dueAt: due == "" ? undefined : new Date(due),
                category: tag
            }

            this.items.push(item);

            this.$refs.name.value = "";
            this.$refs.due.value = "";
            this.$refs.tag.value = "";
            this.showExtraDetails = false;

            this.saveChecklist();
        },
        handleChecklistItem(event){
            if(event.event == "checked"){
                // replace item in list with checked event.data
                var index = this.items.findIndex(item => item.createdAt == event.data.createdAt && item.name == event.data.name);
                this.items[index] = event.data;

                if(event.data.checkedAt != undefined){
                    this.sendEncouragement(this.randomEncouragementMessage());
                }
                
            }
            else if(event.event == "deleted"){
                // remove item from list
                var index = this.items.findIndex(item => item.createdAt == event.data.createdAt && item.name == event.data.name);
                if(index != -1) this.items.splice(index, 1);
            }
            this.saveChecklist();
        },
        randomEncouragementMessage(){
            var messages = ["Nice", "Good job!", "Awesome!", "Keep it up!", "You're doing great!"];
            return messages[Math.floor(Math.random() * messages.length)];
        },
        async saveChecklist(){
            await writeTextFile('checklist.json', JSON.stringify(this.items), { dir: BaseDirectory.AppData });
        },
        async readSchedule(){
            var objects = [];
            try{
                var checklist = await readTextFile('checklist.json', { dir: BaseDirectory.AppData });
                objects = JSON.parse(checklist);
            }catch(e){
                console.log(e);
            }

            console.log(objects);
            
            var finalChecklist = [];
            objects.forEach(e => {
                if(e.dueAt != undefined){
                    e.dueAt = new Date(e.dueAt);
                }
                if(e.checkedAt != undefined){
                    e.checkedAt = new Date(e.checkedAt);
                }
                if(e.createdAt != undefined){
                    e.createdAt = new Date(e.createdAt);
                }

                finalChecklist.push(e);
            })

            this.items = finalChecklist;
            
        },
        sendEncouragement(text){
            this.$emit('encourage', text);
        },
        highPriorityItems(){
            var items = this.items.filter(item => item.dueAt != undefined);
            items.sort((a, b) => a.dueAt - b.dueAt);
            return items;
        
        },
        lowPriorityItems(){
            var items = this.items.filter(item => item.dueAt == undefined);

            items.sort((a, b) => a.createdAt - b.createdAt);

            return this.items.filter(item => item.dueAt == undefined);
        },
        handleEventsFromAbove(event){
            if(event.event == "viewMode"){
                this.viewMode = event.data;
            }
        }
    },
    mounted(){
        this.updateUsedCategories();

        this.readSchedule();

        this.$emit("setcb", this.handleEventsFromAbove);
    }
    
}
</script>