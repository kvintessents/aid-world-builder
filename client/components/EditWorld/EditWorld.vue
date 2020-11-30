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
        position: relative;
    }
</style>