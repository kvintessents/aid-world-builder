<template>
    <div class="list" >
        <Node v-for="node in nodes" :key="node.id" :node="node" :positioned="false" />
    </div>
</template>

<script>
import Node from '~/components/EditWorld/Node/Node';

export default {
    components: { Node },
    data() {
        return {

        }
    },
    computed: {
        nodes() {
            return this.$store.state.world.nodes;
        }
    },
    methods: {
    }
}
</script>

<style scoped>
    .list {
        display: flex;
        flex-wrap: wrap;
    }
</style>