<template>
    <div class="status-bar">
        {{ $store.state.world.syncingCalls ? '⌛' : '✅' }}
    </div>
</template>

<script>
export default {
    methods: {
    }
}
</script>