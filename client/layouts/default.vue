<template>
    <div class="page-container">
        <header class="page-header">
            <NavBar />
        </header>

        <nuxt class="content-wrapper" />
    </div>
</template>

<script>
    import NavBar from '~/components/NavBar/NavBar';

    export default {
        components: { NavBar },
    };
</script>

<style lang="scss">
    .page-header {
        position: sticky;
        z-index: 100;
        top: 0;
        height: 50px;
    }

    .page-container {
        width: 100vw;
        height: 100vh;
    }

    .content-wrapper {
        width: 100vw;
        height: calc(100vh - 50px);
    }
</style>
