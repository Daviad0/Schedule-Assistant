<template>
    <lottie-player class="cursor-pointer" :speed="speed == undefined || speed == null ? 1 : speed" :class="this.mode == 'click'||this.mode == 'toggle'? 'hover-big' : ''" ref="lottie" :src="src" :background="background" :loop="mode == 'loop' || loop" :autoplay="mode == 'loop'"></lottie-player>
</template>
<script>

export default {
    name: "Lottie",
    props: {
        src: String,
        mode: String,
        background: String,
        loop: Boolean,
        key: String,
        speed: Number,
        toggledinit: Boolean
    },
    data(){
        return {
            toggled: false,
            direction: 1
        }
    },
    mounted() {
        
        if(this.mode == "keyhold"){
            // set speed of lottie
            this.$refs.lottie.setSpeed(this.speed);
        }else if(this.mode == "toggle" && this.toggledinit == true){
            
            setTimeout(() => {
                this.toggled = true;
                this.$refs.lottie.setDirection(1);
                this.$refs.lottie.play();
                this.direction = this.toggled ? 1 : -1;
            }, 100);
            
        }
        this.$refs.lottie.addEventListener("mouseenter", () => {
            if (this.mode == "hover") {
                this.$refs.lottie.setDirection(1);
                this.$refs.lottie.play();
                this.direction = 1;
            }
        });
        this.$refs.lottie.addEventListener("mouseleave", () => {
            if (this.mode == "hover") {
                if(this.loop){
                    this.$refs.lottie.stop();
                }else{
                    this.$refs.lottie.setDirection(-1);
                    this.$refs.lottie.play();
                    this.direction = -1;
                }
                
            }
        });
        this.$refs.lottie.addEventListener("click", () => {
            if (this.mode == "click") {
                this.$refs.lottie.setDirection(1);
                this.$refs.lottie.play();
            }else if(this.mode == 'toggle'){
                this.toggled = !this.toggled;
                this.$emit('toggle', this.toggled)
                this.$refs.lottie.setDirection(this.toggled ? 1 : -1);
                this.$refs.lottie.play();
                this.direction = this.toggled ? 1 : -1;
            }
        });
        // document keydown event

        document.addEventListener('keydown', (e) => {
            if (this.mode == "keyhold") {
                console.log("Up", e.key)
                if(e.key == "n"){
                    this.$refs.lottie.setDirection(1);
                    this.$refs.lottie.play();
                    this.direction = 1;
                }
            }
        });
        document.addEventListener('keyup', (e) => {
            if (this.mode == "keyhold") {
                console.log("Down", e.key)
                if(e.key == "n"){
                    this.$refs.lottie.setDirection(-1);
                    this.$refs.lottie.play();
                    this.direction = -1;
                }
            }
        });
        
        // once the animation is done, reset it to the beginning and stop it
        this.$refs.lottie.addEventListener("complete", () => {
            if(this.mode == 'click'){
                this.$refs.lottie.seek(0);
                this.$refs.lottie.stop();
            }
            // and is on last frame
            if(this.mode == 'keyhold' && this.direction == 1){
                this.$emit('keyhold');
                this.$refs.lottie.seek(0);
                this.$refs.lottie.stop();
            }
        });
    },
}
</script>