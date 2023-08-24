<template>
    
    <div class="light-container transparent-border text cursor-pointer" ref="dropdown" @click="tryToggleOpen()" >
        <div class="flex-apart" :style="initwidth != undefined ? 'width:' + initwidth : ''">
            <div class="flex-center">
                <span class="text f-medium" style="text-align: left;opacity: 0.6;white-space:nowrap;overflow-x:hidden" :style="selectedOptions.length > 0 ? 'max-width:0px;opacity:0' : 'max-width:100%;opacity:1;margin-right:20px'">Select an Option</span>
                <div class="flex-center" style="flex-wrap: wrap;overflow:hidden" :style="selectedOptions.length == 0 ? 'max-width:0px;max-height:0px;opacity:0' : 'max-width:100%;max-height:100%;opacity:1' ">
                    <div @click="removeOption(selectedOption, $event)" v-for="selectedOption in selectedOptions" class="highlight-container">
                        <span class="text f-small">{{ getApplicableOption(selectedOption) }}</span>

                    </div>
                </div>
            </div>
            
            <Lottie :src="'Dropdown.json'" :mode="'loop'" style="width:20px" :style="(open ? 'transform:rotate(180deg);' : 'transform:rotate(0deg);') + (showAvailableOptions().length > 0 ? 'opacity:1' : 'opacity:0')" :background="'transparent'"/>
        </div>
        
    </div>
    <div style="position: relative;">
        <div style="position: absolute;top:-10px;left:0;overflow-y:hidden;z-index: 1001;" :style="!open ? 'max-height:0px' : 'max-height:100vh'">
            <div class="solid-container transparent-border text shadow" :style="'width:' + this.width + 'px'">
                <div class="highlight-container hover-darken cursor-pointer" @click="selectOption(optionId)" v-for="optionId in showAvailableOptions()">
                    <span class="text f-medium center block">{{ getApplicableOption(optionId) }}</span>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "MultiDropdown",
        props:{
            options: Array,
            optionids: Array,
            placeholder: String,
            value: String,
            initwidth: String
        },
        data(){
            return {
                selectedOptions: [],
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
                    this.selectedOptions = this.value;
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


                if(this.selectedOptions.includes(optionId)){
        
                    return;
                }

                this.selectedOptions.push(optionId);
                
                this.open = false;

                this.$emit('change', this.selectedOptions);
               

                
            },
            removeOption(optionId, event){
                event.stopPropagation();
                var index = this.selectedOptions.indexOf(optionId);
                if(index == -1){
                    return;
                }
                this.selectedOptions.splice(index, 1);
                this.$emit('change', this.selectedOptions);
            },
            showAvailableOptions(){
                var itemsToShow = this.optionids.filter(optionId => !this.selectedOptions.includes(optionId));
                return itemsToShow;
            },
            tryToggleOpen(){
                if(this.open){
                    this.open = false;
                    return;
                }

                if(this.showAvailableOptions().length > 0){
                    this.open = true;
                }
            }
        }
    }
</script>