<template>
    <div class="container">
        <GraphControls class="container__controls" />
        <Graph class="container__graph" />
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
    .container {
        padding: 2em;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
        user-select: none;
    }

    .container__controls {
        width: 100%;
        height: 40px;
    }

    .container__graph {
        width: 100%;
        height: calc(100% - 40px);
        overflow: hidden;
    }
</style>