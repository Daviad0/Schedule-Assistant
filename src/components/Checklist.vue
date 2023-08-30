<template>
    <div style="height:100%;padding:20px;border-radius: 16px;" :style="viewMode == 'schedule-top' ? 'margin:0px 20px' : 'margin:20px'" ref="base" class="dashed-border">
        <div style="height:100%;">
            <div class="flex-apart">
                <div style="width:100%">
                    <div class="flex-center" style="margin:0px 5px;margin-bottom: 10px;">
                        <input v-on:keydown.enter="createItem()" @keyup="updateName($event.srcElement.value)" ref="name" class="raised-container transparent-border text f-medium" style="text-align: left;width:100%" placeholder="Add To-Do Item"/>
                        <Lottie @click="createItem()" :src="'AddDown2.json'" :mode="'click'" style="width:30px;margin-left:15px" :background="'transparent'"/>
                    </div> 
                    <div style="overflow-y: hidden;" :style="showExtraDetails ? 'max-height:500px' : 'max-height:0px'">
                        <div class="flex-apart">
                            <div style="width:30%;margin:0px 5px">
                                <span class="text f-small block" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Use Tag</span>
                                <input ref="tag" class="raised-container transparent-border text f-medium" style="text-align: left;width:100%" placeholder="Work"/>
                                
                            </div>
                            <div style="width:60%;margin:0px 5px">
                                <span class="text f-small block" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Due At</span>
                                <input ref="due" class="raised-container transparent-border text f-small center" style="padding:8px 0px;width:100%" type="datetime-local"/>
                            </div>
                            
                            
                        </div>
                        <div class="flex-apart" style="margin-top:10px;resize: none;">
                            <div style="width:90%;margin:0px 5px">
                                <span class="text f-small block" style="text-align: left;margin-left: 10px;margin-bottom:2px;white-space: nowrap;">Additional Information</span>
                                <textarea ref="extra" class="raised-container transparent-border text f-medium" style="text-align: left;width:100%;height:80px" placeholder="Optional Extra Information"></textarea>
                                
                            </div>
                            
                            
                            
                        </div>
                    </div>
                    
                    
                </div>
                <div style="width:100%;overflow-x:hidden" :style="showExtraDetails ? 'max-width:0px' : 'max-width:100%'">
                    <div class="flex-center" style="margin:0px 5px;margin-bottom: 10px;">
                        <input ref="filter" class="raised-container transparent-border text f-medium" style="text-align: left;" placeholder="Filter By Content"/>
                        
                    </div>
                </div>
            </div>
            
             
            
            <div style="margin-top:20px;width:100%;height:80%" ref="itemlist">
                <div class="flex-center" style="align-items: start;height:100%" v-if="viewMode == 'schedule-top'">
                    <div style="width:100%;overflow-y:auto;overflow-x:hidden;white-space: nowrap;" :key="this.filterUpdate"  :style="(showExtraDetails ? 'max-height:60%;' : 'max-height:80%;') + (highPriorityItems().length > 0 ? 'max-width:100%' : 'max-width:0%')">
                        <div v-for="item in highPriorityItems()">
                    
                            <ChecklistItem @event="handleChecklistItem($event)" :data="item"/>
                            
                            
                        </div>
                    </div>
                    <div style="width:100%;overflow-y:auto;overflow-x:hidden;white-space: nowrap;" :key="this.filterUpdate" :style="(showExtraDetails ? 'max-height:60%;' : 'max-height:80%;') + (lowPriorityItems().length > 0 ? 'max-width:100%' : 'max-width:0%')">
                        <div v-for="item in lowPriorityItems()">
                    
                            <ChecklistItem @event="handleChecklistItem($event)" :data="item"/>
                            
                            
                        </div>
                    </div>
                    
                </div>
                <div v-if="viewMode == 'schedule-side'" style="overflow-y:auto;" :key="this.filterUpdate" :style="showExtraDetails ? 'max-height:80%' : 'max-height:90%'">
                    <div v-for="item in properlyPrioritizedItems()" >
                    
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
            items: [],
            showExtraDetails: false,
            usedCategories: [],
            viewMode: "schedule-side",
            notifsSentForIds: [],
            filter: "",
            filterUpdate: 0
        }
    },
    methods: {
        updateName(text){
            var oldSED = this.showExtraDetails;
            this.showExtraDetails = text != "";


            if(oldSED != this.showExtraDetails){
                setTimeout(() => {
                    this.$refs.itemlist.style.display = "none";
                    setTimeout(() => {
                        this.$refs.itemlist.style.display = "";
                    }, 10);
                    
                }, 500);
                
                
                

            }
        },
        updateFilter(){
            this.filter = this.$refs.filter.value;
            this.filterUpdate++;
            console.log("FILTER UPDATE", this.filter)
        },
        updateUsedCategories(){
            this.usedCategories = this.items.map(item => item.category).filter((value, index, self) => self.indexOf(value) === index);
        },
        createItem(){
            var name = this.$refs.name.value;
            var due = this.$refs.due.value;
            var tag = this.$refs.tag.value;
            var extra = this.$refs.extra.value;

            if(name == ""){
                return;
            }
            
            var item = {
                name: name,
                checkedAt: undefined,
                createdAt: new Date(),
                dueAt: due == "" ? undefined : new Date(due),
                category: tag,
                extra: extra == "" ? undefined : extra
            }

            this.items.push(item);

            this.$refs.name.value = "";
            this.$refs.due.value = "";
            this.$refs.tag.value = "";
            this.$refs.extra.value = "";
            this.showExtraDetails = false;

            setTimeout(() => {
                    this.$refs.itemlist.style.display = "none";
                    setTimeout(() => {
                        this.$refs.itemlist.style.display = "";
                    }, 10);
                    
                }, 500);
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
            await writeTextFile('checklist.json', JSON.stringify(this.items), { dir: BaseDirectory.Config });
            this.$store.dispatch("backup");
        },
        async readSchedule(){
            var objects = [];
            try{
                var checklist = await readTextFile('checklist.json', { dir: BaseDirectory.Config });
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
            var showMessage = this.$store.getters.getSettingValue("check_show_encouraging_message") == undefined ? "always" : this.$store.getters.getSettingValue("check_show_encouraging_message");
            if(showMessage == "disable"){
                return;
            }
            this.$emit('encourage', text);
        },
        highPriorityItems(){
            var items = this.items.filter(item => item.dueAt != undefined);
            items.sort((a, b) => a.dueAt - b.dueAt);
            items = items.filter(item => item.name.includes(this.filter) || item.category.includes(this.filter) || (item.extra != undefined && item.extra.includes(this.filter)));
            console.log("UPDATED FILTER ITEMS", items)
            return items;
        
        },
        lowPriorityItems(){
            var items = this.items.filter(item => item.dueAt == undefined);

            items.sort((a, b) => a.createdAt - b.createdAt);
            items = items.filter(item => item.name.includes(this.filter) || item.category.includes(this.filter) || (item.extra != undefined && item.extra.includes(this.filter)));
            console.log("UPDATED FILTER ITEMS", items)
            return this.items.filter(item => item.dueAt == undefined);
        },
        properlyPrioritizedItems(){
            var howToSort = this.$store.getters.getSettingValue("check_category_sort") == undefined ? "due_soon" : this.$store.getters.getSettingValue("check_category_sort");

            if(howToSort == "due_soon"){
                return this.highPriorityItems().concat(this.lowPriorityItems());
            }else if(howToSort == "alphabetical"){
                return this.items.sort((a, b) => a.name.localeCompare(b.name));
            }else if(howToSort == "recently_used"){
                return this.items.sort((a, b) => b.createdAt - a.createdAt);
            }

            return this.highPriorityItems().concat(this.lowPriorityItems());

        },
        handleEventsFromAbove(event){
            if(event.event == "viewMode"){
                this.viewMode = event.data;
            }
        },
        checkForAnyNotifs(){
            var notifyTime = 10;
            if(this.$store.getters.getSettingValue("check_show_notification") != undefined){
                notifyTime = parseInt(this.$store.getters.getSettingValue("check_show_notification"));
            }
            if(notifyTime < 0) return;
            this.items.forEach(e => {
                if(e.dueAt == undefined) return;
                if(e.dueAt > new Date() && (e.dueAt.getTime() - (new Date().getTime()) < 1000*60*notifyTime) && !this.notifsSentForIds.includes(e.name + e.dueAt.getTime())){
                    this.notifsSentForIds.push(e.name + e.dueAt.getTime());
                    sendNotification({title: "Item Due Soon!", body: e.title + " is due soon!"});
                }
            });
        }
    },
    mounted(){
        this.updateUsedCategories();

        this.readSchedule();

        this.$emit("setcb", this.handleEventsFromAbove);
        setTimeout(() => {
            this.$refs.filter.addEventListener("keyup", () => {
                this.updateFilter();
            });
            
        }, 500);

        setInterval(() => {
            this.checkForAnyNotifs();
        }, 1000*20);
    }
    
}
</script>