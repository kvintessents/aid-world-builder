<template>
    <component
        v-bind="linkProps()"
        :is="'a'"
        :title="post.title"
    >
        <slot></slot>
    </component>
</template>

<script>
export default {
  name: 'PostLink',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    linkProps () {
      if (this.post.type === 'link') {
        return {
          is: 'a',
          href: this.post.link,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'nuxt-link',
        to: this.post.permalink_path
      }
    }
  }
}
</script>