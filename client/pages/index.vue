<template>
    <div>
        <PageError v-if="pageError" :pageError="pageError" />
    </div>
</template>
<script>
    import PageError from '~/components/PageError';

    export default {
        layout: 'default',
        components: { PageError },
        async fetch({ store, $axios }) {
            try {
                // const response = await $axios.get('/posts');
                // store.commit('posts/set', response.data.data);
            } catch (e) {
                console.log(e);
                this.pageError = e;
            }
        },
        data() {
            return {
                pageError: null,
                loadingNextPosts: false,
            }
        },
        computed: {
            posts() {
                return this.$store.state.posts.list;
            }
        },
        mounted() {
            window.addEventListener("scroll", this.handleScroll);
        },
        destroyed() {
            window.removeEventListener("scroll", this.handleScroll);
        },
        methods: {
            handleScroll() {
                if (this.loadingNextPosts) {
                    return;
                }

                if (!this.isCloseToBottom()) {
                    return;
                }
                
                this.loadNext();
            },
            isCloseToBottom() {
                const diff = document.body.clientHeight - (window.scrollY + window.innerHeight);

                if (diff <= 200) {
                    return true;
                }

                return false;
            },
            async loadNext() {
                this.loadingNextPosts = true;
                const response = await this.$axios.get('/posts', { params: { offset: this.posts.length }});
                const posts = response.data.data;

                if (posts.length) {
                    this.$store.commit('posts/add', posts);
                }

                this.loadingNextPosts = false;
            },
        }
    }
</script>