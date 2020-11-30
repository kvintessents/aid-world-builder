<template>
    <label class="wrapper">
        <div v-if="label" class="label">
            {{ label ? label : '' }}
        </div>
    
        <input
            class="input"
            v-model="localValue"
            :type="type"
            :class="{
                disabled: disabled,
                loading: loading
            }"
            :placeholder="label"
        />
    </label>
</template>

<script>
export default {
    props: {
        disabled: { type: Boolean, required: false },
        loading: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        label: { type: String, default: null }
    },
    computed: {
        localValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .input {
        padding: calc(1em - 1px) 1.25em;
        border-radius: 0.25em;
        border: 1px solid #aaa;
        font-size: 1em;
        width: 100%;
        box-sizing: border-box;
        font-family: inherit;
        font-weight: inherit;
    }

    .wrapper {
        display: block;
        margin-bottom: 1em;
    }

    .wrapper[no-margin] {
        margin-bottom: 0;
    }

    .label {
        margin-bottom: 0.5em;
    }
</style>