<template>
    <div style="margin:20px;height:100%;width:100%;padding:20px;border-radius: 16px;" class="dashed-border" ref="base">
        <div style="height:100%;flex-direction: column;justify-content: start;" class="flex-center">
            <div>

            </div>
            <div style="flex-wrap: wrap;" class="flex-center">
                <div v-for="document in documents" style="margin:10px">
                    <div class="raised-container cursor-pointer" style="width:100px;height:60px;margin-bottom:15px;border-top-left-radius: 4px;" @click="openDocument(document)">

                    </div>
                    <span class="text f-medium center block">{{ document.name }}</span>
                </div>
            </div>
        </div>
    </div>


</template>
<script>
export default {
    name: "Notes",
    data(){
        return {
            documents: [
                {
                    name: "Document 1",
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    content: "This is the content of document 1",
                    remindAt: undefined
                },
                {
                    name: "TODO",
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    content: "This is the content of document 1",
                    remindAt: undefined
                }
            ]
        }
    },
    methods: {
        editNote(data){
            
        },
        openDocument(document){
            this.$emit("overlay", document);
        },
        handleEventsFromAbove(name, data){

            // if(name == 'editNote'){
            //     this.createScheduleObject(data);
            // }else if(name == 'createNote'){
            //     this.deleteScheduleItem(data);
            // }else if(name == 'deleteNote'){
            //     this.deleteScheduleItem(data);
            // }
        },
    }
}
</script>