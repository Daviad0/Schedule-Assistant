<template>
    <div class="raised-container blur-bg flex-apart" style="width:100%;height:100%;flex-direction: column;">
        <div class="flex-center" style="margin:20px 0px;width:100%">
            <div class="flex-center">
                <span class="text f-xlarge f-bold" style="margin-right:10px">Editing</span>
                <input ref="notename" class="raised-container transparent-border text f-large" style="text-align: left" placeholder="Name of Note" :value="currentNote.name"/>

            </div>
            
        </div>
        <div style="height:100%;width:100%;overflow-y:auto;text-align: left;">
            <textarea ref="mdeEditor" style="text-align: left;height:100%;width:100%" class="left-align">

            </textarea>
        </div>
        <div class="flex-center" style="margin-right:25px;margin-bottom:10px;width:100%;justify-content: end;">
            <Lottie @click="deleteNote()" v-if="this.note != undefined" :src="'Trash.json'" :mode="'click'" :background="'transparent'"
                style="width:60px;margin-right:20px" />
            <Lottie @click="closeNote()" :src="'Cancel.json'" :mode="'click'" :background="'transparent'"
                style="width:60px" />
            <Lottie @click="saveNote()" :src="'Checkmark2.json'" :mode="'click'" :background="'transparent'"
                style="width:60px" />
            
        </div>
    </div>
    
</template>

<script>



export default {
    name: "NoteOverlay",
    props: {
        note: Object
    },
    data(){
        return {
            mde: undefined,
            currentNote: {
                name: "",
                content: "",
                createdAt: undefined,
                modifiedAt: undefined,
                remindAt: undefined
            },
            rememberName: ""
        }
    },
    mounted(){

        if(this.note != undefined){
            this.currentNote = this.note;
            this.rememberName = this.note.name;
        }
        else{
            this.currentNote = {
                name: "New Note",
                content: "",
                createdAt: undefined,
                modifiedAt: undefined,
                remindAt: undefined
            }
        }

        setTimeout(() => {
            this.mde = new SimpleMDE({
                element: this.$refs.mdeEditor,
                initialValue: this.currentNote.content,
                placeholder: "Type your things here...",
                insertTexts: {
                    horizontalRule: ["", "\n\n-----\n\n"],
                    image: ["![](http://", ")"],
                    link: ["[", "](http://)"],
                    table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
                }
            });

            this.mde.codemirror.on("change", () => {
                this.currentNote.content = this.mde.value();
                this.currentNote.modifiedAt = new Date();
            });
            this.$refs.notename.addEventListener("change", () => {
                this.currentNote.name = this.$refs.notename.value;
            });
        }, 100);
        
    },
    methods: {
        closeNote() {
            this.$emit('close');
        },
        deleteNote() {
            this.$emit('save', {
                note: this.note,
                mode: "delete"
            });
            setTimeout(() => {
                this.$emit('close');
            }, 100);
            
        },
        saveNote(){

            var mode = 'edit';
            if(this.currentNote.name == ""){
                this.$refs.notename.focus();
                return;
            }
            if(this.rememberName != "" && this.rememberName != this.currentNote.name){
                this.currentNote.oldName = this.rememberName;
            }
            if(this.currentNote.createdAt == undefined){
                this.currentNote.createdAt = new Date();
                this.currentNote.modifiedAt = new Date();
                mode = 'create';
            }

            this.$emit('save', {
                note: this.currentNote,
                mode: mode
            });
        }
    }
}
</script>