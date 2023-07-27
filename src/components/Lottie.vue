<template>
    <lottie-player class="cursor-pointer" :class="this.mode == 'click'||this.mode == 'toggle'? 'hover-big' : ''" ref="lottie" :src="src" :background="background" :loop="mode == 'loop' || loop" :autoplay="mode == 'loop'"></lottie-player>
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
        speed: Number
    },
    data(){
        return {
            toggled: false
        }
    },
    mounted() {
        if(this.mode == "keyhold"){
            // set speed of lottie
            this.$refs.lottie.setSpeed(this.speed);
        }
        this.$refs.lottie.addEventListener("mouseenter", () => {
            if (this.mode == "hover") {
                this.$refs.lottie.setDirection(1);
                this.$refs.lottie.play();
            }
        });
        this.$refs.lottie.addEventListener("mouseleave", () => {
            if (this.mode == "hover") {
                if(this.loop){
                    this.$refs.lottie.stop();
                }else{
                    this.$refs.lottie.setDirection(-1);
                    this.$refs.lottie.play();
                }
                
            }
        });
        this.$refs.lottie.addEventListener("click", () => {
            if (this.mode == "click") {
                this.$refs.lottie.setDirection(1);
                this.$refs.lottie.play();
            }else if(this.mode == 'toggle'){
                this.toggled = !this.toggled;
                this.$refs.lottie.setDirection(this.toggled ? 1 : -1);
                this.$refs.lottie.play();
            }
        });
        // document keydown event

        document.addEventListener('keydown', (e) => {
            if (this.mode == "keyhold") {
                console.log("Up", e.key)
                if(e.key == "n"){
                    this.$refs.lottie.setDirection(1);
                    this.$refs.lottie.play();
                }
            }
        });
        document.addEventListener('keyup', (e) => {
            if (this.mode == "keyhold") {
                console.log("Down", e.key)
                if(e.key == "n"){
                    this.$refs.lottie.setDirection(-1);
                    this.$refs.lottie.play();
                }
            }
        });
        
        // once the animation is done, reset it to the beginning and stop it
        this.$refs.lottie.addEventListener("complete", () => {
            if(this.mode == 'click'){
                this.$refs.lottie.seek(0);
                this.$refs.lottie.stop();
            }
        });
    },
}
</script>