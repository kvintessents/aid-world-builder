<template>
    <div v-show="isActive">
        <slot />
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                isActive: false,
            };
        },
        created() {
            this.isActive = this.$parent.$parent.tabs.indexOf(this.$vnode) === 0;
        },
    };
</script>
