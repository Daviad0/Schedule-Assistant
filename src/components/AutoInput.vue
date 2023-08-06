<template>
    
    <input style="display:block;text-align: left;width:100%" class="raised-container transparent-border text f-small" ref="input" :placeholder="placeholder"/>
    <div style="position: relative;">
        <div style="position: absolute;top:0px;left:0;overflow-y:hidden;z-index: 1001;" :style="!open ? 'max-height:0px' : 'max-height:100vh'">
            <div class="solid-container transparent-border text shadow" :style="'width:' + this.width + 'px'">
                <div class="highlight-container hover-darken cursor-pointer" @click="selectOption(option)" v-for="option in showOptions">
                    <span class="text f-medium">{{ option }}</span>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "AutoInput",
    props: {
        type: String,
        autofill: Array,
        placeholder: String
    },
    data(){
        return {
            open: false,
            width: 100,
            showOptions: [],
            value: ""
        }
    },
    mounted(){
        setTimeout(() => {
            this.width = this.$refs.input.clientWidth;
        }, 100);

        this.$refs.input.addEventListener("keyup", () => {
            this.getApplicableOptions();
            this.value = this.$refs.input.value;
        });
    },
    methods: {
        getApplicableOptions(){
            var search = this.$refs.input.value;
            if(search == ""){
                this.showOptions = [];
                this.open = false;
                return;
            }

            // get all options that contain the search string and sort them by how exactly they match the search string
            var options = this.autofill.filter(option => option.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
                var aIndex = a.toLowerCase().indexOf(search.toLowerCase());
                var bIndex = b.toLowerCase().indexOf(search.toLowerCase());
                if(aIndex == bIndex){
                    return a.length - b.length;
                }
                return aIndex - bIndex;
            });

            this.showOptions = options;
            
            this.open = this.showOptions.length > 0;
        },
        selectOption(option){
            this.$refs.input.value = option;
            this.value = option;
            this.open = false;
        }
    }
}
</script>