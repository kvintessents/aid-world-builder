<template>
    <div class="worlds">
        <Paper v-if="$auth.user" padded-2 class="create-world">
            <form @submit.prevent="onSubmit" :disabled="creating">
                <FormRow>
                    <Input label="New World Name" v-model="worldName" />
                    <Button type="submit">Create</Button>
                </FormRow>
            </form>
        </Paper>

        <Paper v-if="$auth.user" padded-2 class="world-list-paper" >
            <h2>Your worlds</h2>
            <ol v-if="worlds.length" class="world-list">
                <li class="world-list-element" v-for="world in worlds" :key="world.id">
                    <nuxt-link :to="`world/${world.id}`">{{ world.name }}</nuxt-link>
                </li>
            </ol>
            <p v-else>Your worlds will appear here.</p>
        </Paper>

        <Paper v-if="publicWorlds.length" padded-2 class="world-list-paper" >
            <h2>Publicly viewable worlds</h2>
            <ol class="world-list">
                <li class="world-list-element" v-for="world in publicWorlds" :key="world.id">
                    <nuxt-link :to="`world/${world.id}`">{{ world.name }}</nuxt-link>
                </li>
            </ol>
        </Paper>
    </div>
</template>

<script>
    import Paper from '~/components/core/atoms/Paper';
    import FormRow from '~/components/core/atoms/FormRow';
    import Input from '~/components/core/atoms/Input';
    import Button from '~/components/core/atoms/Button';

    async function fetchWorlds($axios, $auth) {
        if (!$auth.user) {
            return [];
        }

        let response;

        try {
            response = await $axios.get('/worlds/', {
                params: {
                    user_id: $auth.user.id
                }
            });
        } catch (e) { console.error('Error fetching user worlds', e); }

        return response.data.data;
    }

    async function fetchPublicWorlds($axios) {
        let response;

        try {
            response = await $axios.get('/public-worlds/');
        } catch (e) { console.error('Error fetching public worlds', e); }

        return response.data.data;
    }

    export default {
        layout: 'default',
        components: { Input, Button, FormRow, Paper },
        data() {
            return {
                creating: false,
                worldName: '',
                worlds: [],
                publicWorlds: [],
            };
        },
        computed: {},
        async asyncData({ $axios, $auth }) {
            const worlds = await fetchWorlds($axios, $auth);
            const publicWorlds = await fetchPublicWorlds($axios);
            return { worlds, publicWorlds };
        },
        methods: {
            async onSubmit() {
                this.creating = true;
                let response;

                try {
                    response = await this.$axios.post('/worlds/', {
                        name: this.worldName,
                        isPublic: false,
                    });

                    this.worlds = await fetchWorlds(this.$axios, this.$auth);
                    this.publicWorlds = await fetchPublicWorlds(this.$axios);
                } catch (e) { console.error(e); }

                this.creating = false;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .worlds {
        max-width: 1000px;
        margin: 0 auto;
    }

    .world-list-paper, .create-world {
        margin-top: 2em;
    }

    .world-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .world-list-element {
        margin-bottom: 0.5em;
    }
</style>