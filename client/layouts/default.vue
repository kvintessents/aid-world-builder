<template>
    <div class="page-container">
        <header class="page-header">
            <NavBar />
        </header>


        <section class="content-wrapper">
            <nuxt />
        </section>
    </div>
</template>

<script>
    import NavBar from '~/components/NavBar/NavBar';
    import Paper from '~/components/core/atoms/Paper';

    export default {
        components: { NavBar, Paper },
    }
</script>

<style lang="scss" scoped>
    .page-header {
        position: sticky;
        z-index: 100;
        top: 0;
    }

    .fake-sidecontent {
        padding: 1em;

        position: sticky;
        top: 5.5rem;
    }
</style>