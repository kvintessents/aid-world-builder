<template>
    <nav class="graph-controls">
        <ul>
            <li><Button @click="$store.dispatch('world/addNode')">Add Node</Button></li>
        </ul>
    </nav>
</template>

<script>

export default {
    methods: {
    }
}
</script>