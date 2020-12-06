<template>
    <div class="container">
        <GraphControls class="container__controls" />

        <Graph v-if="nodeView" class="container__graph" />
        <List v-else class="container__list" />

        <StatusBar />
    </div>
</template>

<script>
import GraphControls from '~/components/EditWorld/GraphControls';
import StatusBar from '~/components/EditWorld/StatusBar';
import Graph from '~/components/EditWorld/Graph';
import List from '~/components/EditWorld/List';

export default {
    components: { GraphControls, Graph, StatusBar, List },
    computed: {
        nodeView() {
            return this.$store.state.world.isNodeView;
        }
    },
    methods: {
    }
}
</script>
<style scoped lang="scss">
    .container {
        padding: 2em;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
    }

    .container__controls {
        width: 100%;
        height: 40px;
    }

    .container__graph {
        width: 100%;
        height: calc(100% - 40px);
        overflow: hidden;
        user-select: none;
    }
</style>