<template>
    <div>
        <Paper padded-2 class="website-description">
            <h2>AID World Builder (alpha)</h2>

            <p>The purpose of this builder is to help you create World Info entries in <strong>Zalty's format</strong> and <strong>JSON format</strong>. Create an account, create your characters and locations as nodes, download the generated World Info file and upload it to AIDungeon.</p>

            <p>For feature requests✨, bug reports🐛 or any other type of feedback <a href="https://discord.com/users/192538574028013568">send me a PM on Discord 💬</a>.</p>
        </Paper>

        <Paper v-if="publicWorlds.length" padded-2 class="world-list-paper">
            <h2>Publicly viewable worlds</h2>
            <WorldList :worlds="publicWorlds" />
        </Paper>
    </div>
</template>
<script>
    import Paper from '~/components/core/atoms/Paper';
    import WorldList from '~/components/WorldList';

    // This should be in Vuex as an action
    async function fetchPublicWorlds($axios) {
        let response;

        try {
            response = await $axios.get('/public-worlds/');
        } catch (e) { console.error('Error fetching public worlds', e); }

        return response.data.data;
    }

    export default {
        layout: 'default',
        components: { Paper, WorldList },
        data() {
            return {
                publicWorlds: [],
            };
        },
        async fetch() {
            this.publicWorlds = await fetchPublicWorlds(this.$axios);
        }
    }
</script>
<style lang="scss" scoped>
    .website-description {
        width: 50em;
        margin: 2em auto;
        line-height: 2em;
    }

    code {
        background: #eee;
        padding: 0 0.33em;
        border-radius: 3px;
    }

    .world-list-paper {
        margin: 0 auto;
        margin-top: 2em;
        width: 50em;
    }
</style>