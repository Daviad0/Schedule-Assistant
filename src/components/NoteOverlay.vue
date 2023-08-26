<template>
    <div class="raised-container blur-bg flex-apart" style="width:100%;height:100%;flex-direction: column;">
        <div class="flex-center" style="margin:20px 0px;width:100%">
            <span class="text f-xlarge f-bold">Editing "{{ note.name }}"</span>
        </div>
        <div style="height:100%;width:100%;overflow-y:auto;text-align: left;">
            <textarea ref="mdeEditor" style="text-align: left;height:100%;width:100%" class="left-align">

            </textarea>
        </div>
        <div class="flex-center" style="margin-right:25px;margin-bottom:10px;width:100%;justify-content: end;">
            <Lottie @click="closeSettings()" :src="'Checkmark2.json'" :mode="'click'" :background="'transparent'"
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
            mde: undefined
        }
    },
    mounted(){
        setTimeout(() => {
            this.mde = new SimpleMDE({
                element: this.$refs.mdeEditor,
                initialValue: this.note.content,
            });
        }, 100);
        
    },
    methods: {
        closeSettings() {
            this.$emit('close');
        }
    }
}
</script>