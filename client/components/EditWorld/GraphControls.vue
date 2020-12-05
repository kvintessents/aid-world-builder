<template>
    <nav class="graph-controls">
        <ul class="list">
            <li class="list-item"><Button small create @click="$store.dispatch('world/addNode')">Add Entry</Button></li>
            <li class="list-item"><Button small @click="downloadJson">Download JSON</Button></li>
            <li class="list-item"><Button small @click="downloadZaltys">Download Zaltys</Button></li>
        </ul>
    </nav>
</template>

<script>
import Button from '~/components/core/atoms/Button';
import jsonFormatter from '~/utils/formatters/jsonFormatter';
import ZaltysFormatter from '~/utils/formatters/ZaltysFormatter';

function download(object) {
    document.body.innerHTML += `
        <a
            id="download"
            download="AID-WORLD.json"
            href="${URL.createObjectURL(new Blob([JSON.stringify(object, null, 2)]))}"
        >Click me</a>
    `;
    window.download.click();
    window.download.outerHTML = "";
}

export default {
    components: { Button },
    methods: {
        downloadJson() {
            const contents = this.$store.state.world.nodes.map(jsonFormatter)
            download(contents);
        },
        downloadZaltys() {
            const contents = this.$store.state.world.nodes.map(ZaltysFormatter)
            download(contents);
        }
    }
}
</script>
<style lang="scss" scoped>
    .list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .list-item {
        display: inline-block;
    }
</style>