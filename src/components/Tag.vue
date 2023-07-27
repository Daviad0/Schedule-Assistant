<template>
    <div class="tag-container flex-center">
        <div class="dot"></div>
        <span class="text f-small">{{name}}</span>
    </div>
</template>

<script>
export default {
    name: "Tag",
    props:{
        name: String
    }
}
</script>