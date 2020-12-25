<template>
    <div class="worlds">
        <Paper v-if="$auth.user" padded-2 class="create-world">
            <form @submit.prevent="onSubmit" :disabled="creating">
                <FormRow>
                    <Input label="New World Name" :value="worldName" @input="onWorldName" />
                    <Button type="submit" :disabled="!worldName.trim() || creating">Create</Button>
                </FormRow>
            </form>
        </Paper>

        <Paper v-if="$auth.user" padded-2 class="world-list-paper" >
            <h2>Your worlds</h2>
            <WorldList v-if="worlds.length" :worlds="worlds" />
            <p v-else>Your worlds will appear here.</p>
        </Paper>

        <Paper v-if="publicWorlds.length" padded-2 class="world-list-paper" >
            <h2>Publicly viewable worlds</h2>
            <WorldList :worlds="publicWorlds" />
        </Paper>
    </div>
</template>

<script>
    import Paper from '~/components/core/atoms/Paper';
    import FormRow from '~/components/core/atoms/FormRow';
    import Input from '~/components/core/atoms/Input';
    import Button from '~/components/core/atoms/Button';
    import WorldList from '~/components/WorldList';

    // This should be in vuex as an action
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

    // This should be in vuex as an action
    async function fetchPublicWorlds($axios) {
        let response;

        try {
            response = await $axios.get('/public-worlds/');
        } catch (e) { console.error('Error fetching public worlds', e); }

        return response.data.data;
    }

    export default {
        layout: 'default',
        components: { Input, Button, FormRow, Paper, WorldList },
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
            onWorldName(value) {
                this.worldName = value;
            },
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

                this.worldName = '';

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
</style>