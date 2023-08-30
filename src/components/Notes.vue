<template>
    <div style="margin:20px;height:100%;width:100%;padding:20px;border-radius: 16px;" class="dashed-border" ref="base">
        
        <div style="height:100%;flex-direction: column;justify-content: start;" class="flex-center">
            <div class="flex-apart" style="width: 100%;">
                <div class="flex-center">
                    <span class="text f-large f-bold" style="margin-right:10px">Notes</span>
                </div>
                <div class="flex-center">
                    <Lottie @click="openDocument(undefined)" :src="'AddDown2.json'" :mode="'click'" style="width:30px" :background="'transparent'"/>
                </div>
            </div>
            <div style="flex-wrap: wrap;overflow-y:auto;height:100%;margin-top:10px" class="flex-center" :key="updateDocuments">
                <div v-for="document in documents.sort((a,b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())" style="margin:10px;max-width: 150px;">
                    <div class="flex-center">
                        <div class="raised-container cursor-pointer flex-center" style="width:100px;height:60px;margin-bottom:15px;border-top-left-radius: 4px;" @click="openDocument(document)">
                            <div>
                                <span class="text f-large f-bold center block" :key="updateTime">{{ getTimeSinceModified(document.modifiedAt) }}</span>
                                <span class="text f-small center block" :key="updateTime">{{ document.content.length }} chars</span>
                            </div>
                        </div>
                    </div>
                    
                    <span class="text f-medium center block" style="word-wrap: break-word;">{{ document.name }}</span>
                </div>
            </div>
        </div>
    </div>


</template>
<script>
import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
export default {
    name: "Notes",
    data(){
        return {
            documents: [
                
            ],
            updateTime: 0,
            updateDocuments: 0
        }
    },
    methods: {
        editNote(data){
            this.documents = this.documents.map(document => {
                if((document.oldName == undefined && document.name == data.name) || (document.oldName != undefined && document.name == data.oldName)){
                    return data;
                }
                return document;
            });

            this.updateDocuments++;
            this.saveNotes();
        },
        async saveNotes(){
            await writeTextFile('notes.json', JSON.stringify(this.documents), { dir: BaseDirectory.Config });
            this.$store.dispatch("backup");
        },
        async readNotes(){
            var objects = [];
            try{
                var notes = await readTextFile('notes.json', { dir: BaseDirectory.Config });
                objects = JSON.parse(notes);
            }catch(e){
                console.log(e);
            }

            console.log(objects);
            
            var finalDocuments = [];
            objects.forEach(e => {
                
                if(e.createdAt != undefined){
                    e.createdAt = new Date(e.createdAt);
                }
                if(e.modifiedAt != undefined){
                    e.modifiedAt = new Date(e.modifiedAt);
                }
                if(e.remindAt != undefined){
                    e.remindAt = new Date(e.remindAt);
                }

                finalDocuments.push(e);
            })

            this.documents = finalDocuments;
            
        },
        createNote(data){
            this.documents.push(data);
            this.saveNotes();
        },
        deleteNote(data){
            console.log("DELETE NOTE", data)
            this.documents = this.documents.filter(document => {
                return document.name != data.name && document.modifiedAt.getTime() != data.modifiedAt.getTime();
            });
            this.saveNotes();
        },
        
        
        openDocument(document){
            this.$emit("overlay", document);
        },
        handleEventsFromAbove(name, data){

            if(name == 'editNote'){
                this.editNote(data);
            }else if(name == 'createNote'){
                this.createNote(data);
            }else if(name == 'deleteNote'){
                this.deleteNote(data);
            }
            // else if(name == 'createNote'){
            //     this.deleteScheduleItem(data);
            // }else if(name == 'deleteNote'){
            //     this.deleteScheduleItem(data);
            // }
            
        },
        getTimeSinceModified(modified){

            var modifiedAt = new Date(modified);
            var now = new Date();

            var total = now.getTime() - modifiedAt.getTime();
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

            // get most accur
        },
    },
    mounted() {

        this.readNotes();

        this.$emit("setcb", this.handleEventsFromAbove);
        setInterval(() => {
            this.updateTime++;
        }, 5000);
    }
}
</script>