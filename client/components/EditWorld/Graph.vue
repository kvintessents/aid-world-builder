<template>
    <div>
        <Node v-for="node in $store.state.world.nodes" :key="node.id" :node="node" />
    </div>
</template>

<script>
import Node from '~/components/EditWorld/Node';

export default {
    components: { Node },
    methods: {
    },
    created() {
    }
}
</script>