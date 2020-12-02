<template>
    <nav class="graph-controls">
        <ul class="list">
            <li class="list-item"><Button small @click="$store.dispatch('world/addNode')">Add Node</Button></li>
            <li class="list-item"><Button small @click="download">Download</Button></li>
        </ul>
    </nav>
</template>

<script>
import Button from '~/components/core/atoms/Button';

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
        download() {
            const contents = this.$store.state.world.nodes.map(node => ({
                id: node.randomId,
                keys: node.tags,
                entry: JSON.stringify({
                    [node.name]: node.properties.reduce((acc, property) => {
                        acc[property.key] = property.value
                        return acc;
                    }, {})
                }),
                isNotHidden: true
            }))
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