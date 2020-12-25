<template>
    <table class="world-list">
        <thead>
            <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Added</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="world in worlds" :key="world.id">
                <td><nuxt-link :to="`world/${world.id}`" class="link">{{ world.name }}</nuxt-link></td>
                <td>
                    <span v-for="n in getLength(world)" :key="n" class="length-filled"></span>
                    <span v-if="getLength(world) === maxLength" class="length-more"></span>
                </td>
                <td class="time">{{ getReadableCreatedAt(world) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import getRelativeTime from '~/utils/getRelativeTime';

    export default {
        props: {
            worlds: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                maxLength: 10,
            }
        },
        methods: {
            getReadableCreatedAt(world) {
                return getRelativeTime(new Date(world.created_at));
            },
            getLength(world) {
                return Math.floor(Math.min(parseInt(world.document_length, 10) / 300, this.maxLength));
            },
        }
    }
</script>

<style lang="scss" scoped>
    .length-filled {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #C1E7F8;
    }

    .length-more {
        display: inline-block;
        width: 3px;
        height: 8px;
        background: #C1E7F8;
    }

    td {
        padding: 0.5em 1em;
    }

    th {
        padding: 0.5em 1em;
        font-weight: 100;
        text-align: left;
    }

    .time {
        font-size: 0.9em;
    }

    .link {
        text-decoration: none;
    }

    .link:hover {
        text-decoration: underline;
    }

</style>