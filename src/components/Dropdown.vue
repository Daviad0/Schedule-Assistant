<template>
    
    <div class="light-container transparent-border text cursor-pointer" ref="dropdown" @click="open = !open" >
        <div class="flex-apart" :style="initwidth != undefined ? 'width:' + initwidth : ''">
            <span class="text f-medium" style="text-align: left;margin-right:20px" :style="selected == '' ? 'opacity: 0.6;' : ''" ref="selectedText">{{ selected == '' ? (placeholder == undefined ? "Select an Option" : placeholder) : (getApplicableOption(selected)) }}</span>
            <Lottie :src="'Dropdown.json'" :mode="'loop'" style="width:20px" :style="open ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)'" :background="'transparent'"/>
        </div>
        
    </div>
    <div style="position: relative;">
        <div style="position: absolute;top:-10px;left:0;overflow-y:hidden;z-index: 1001;" :style="!open ? 'max-height:0px' : 'max-height:100vh'">
            <div class="solid-container transparent-border text shadow" :style="'width:' + this.width + 'px'">
                <div class="highlight-container hover-darken cursor-pointer" @click="selectOption(optionId)" v-for="optionId in optionids">
                    <span class="text f-medium">{{ getApplicableOption(optionId) }}</span>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dropdown",
    props:{
        options: Array,
        optionids: Array,
        placeholder: String,
        value: String,
        initwidth: String
    },
    data(){
        return {
            selected: "",
            open: false,
            width: 100
        }
    },
    mounted(){
        if(this.optionIds == undefined || this.options.length != this.optionIds.length){
            this.optionIds = this.options.map((option, index) => index);
        }

        

        setTimeout(() => {
            if(this.value != undefined){
                this.selected = this.value;
            }
            this.width = this.$refs.dropdown.clientWidth;
        }, 100);
    },
    methods: {
        getApplicableOption(optionId){
            var index = this.optionids.indexOf(optionId);
            if(index == -1){
                return undefined;
            }
            return this.options[index];
        },
        selectOption(optionId){
            if(this.selected == optionId){
                this.open = false;
                return;
            }
            this.$refs.selectedText.style.opacity = 0;
            this.open = false;
            setTimeout(() => {
                this.selected = optionId;
                
                this.$emit('change', optionId);
                setTimeout(() => {
                    this.$refs.selectedText.style.opacity = 1;
                }, 100);
            }, 400);

            
        }
    }
}

</script>