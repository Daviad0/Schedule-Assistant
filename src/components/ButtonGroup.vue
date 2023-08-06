<template>
    <div class="flex-apart light-container transparent-border" style="padding:5px" :style="getTheFreakingDefaultWidthYouGoshdarnSonOfA ? 'opacity:1' : 'opacity:0'">
        <div style="position: relative">
            <div class="raised-container" style="position:absolute;top:0;left:0;width:0px;height:0px;padding:0px;transform: translateY(-50%);border-radius: 12px;" ref="slider">

            </div>
        </div>
        <div ref="default" @click="setOption($event.srcElement, $event.srcElement.offsetWidth, buttons[selectedindex == undefined ? 0 : selectedindex])" :style="getTheFreakingDefaultWidthYouGoshdarnSonOfA ? 'display:none' : 'display:block'" class="nohighlight-container cursor-pointer" style="margin:5px;width:100%;">
            <span class="text f-medium" style="pointer-events: none;">{{ buttons[selectedindex == undefined ? 0 : selectedindex] }}</span>
        </div>

        <div v-for="button in buttons" :ref="'option' + buttons.indexOf(button)" @click="setOption($event.srcElement, $event.srcElement.offsetWidth, button)" class="hover-darken2 nohighlight-container cursor-pointer" style="margin:5px;width:100%;" :style="this.selected == button ? 'background-color:transparent' : ''">
            <span class="text f-medium" style="pointer-events: none;">{{ button }}</span>
        </div>
        
    </div>
</template>
<script>
export default {
    name: "ButtonGroup",
    props: {
        buttons: Array,
        selectedindex: Number
    },
    data(){
        return {
            selected: "",
            getTheFreakingDefaultWidthYouGoshdarnSonOfA: false
        }
    },
    methods: {
        setOption(o, width, option){
            console.log("SET OPTION " + option, o, width);
            var slider = this.$refs.slider;

            slider.style.height = (o.clientHeight-10) + "px";
            slider.style.padding = "";

            slider.style.width = (width-10) + "px";
            var left = o.offsetLeft - o.parentElement.offsetLeft - o.parentElement.clientLeft -
    parseInt(getComputedStyle(o.parentElement).paddingLeft);
            slider.style.left = (left-5) + "px";
            this.selected = option;
            this.getTheFreakingDefaultWidthYouGoshdarnSonOfA = true;
            this.$emit("change", option);
        }
    },
    mounted(){
        var defaultOption = this.$refs.default;
        setTimeout(() => {
            this.$refs.default.click();
            
        }, 100);
        
    }
}
</script>