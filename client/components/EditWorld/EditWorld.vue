<template>
    <div class="create-world-container">
        <GraphControls />
        <Graph />
        <StatusBar />
    </div>
</template>

<script>
import GraphControls from '~/components/EditWorld/GraphControls';
import StatusBar from '~/components/EditWorld/StatusBar';
import Graph from '~/components/EditWorld/Graph';

export default {
    components: { GraphControls, Graph, StatusBar },
    methods: {
    }
}
</script>
<style scoped lang="scss">
    .create-world-container {
        padding: 2em;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
        user-select: none;
    }
</style>