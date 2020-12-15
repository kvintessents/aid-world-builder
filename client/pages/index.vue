<template>
    <div>
        <Paper padded-2 class="website-description">
            <h2>AID World Builder (alpha)</h2>

            <p>The purpose of this builder is to help you create World Info entries in <strong>Zalty's format</strong> and <strong>JSON format</strong>. Create an account, create your characters and locations as nodes, download the generated World Info file and upload it to AIDungeon.</p>

            <p>The UI is not yet very beginner friendly, but here is how you can do things:</p>
            <ul>
                <li><strong>Create a new property</strong> by hitting <code>TAB</code> on the value field of the last row.</li>
                <li><strong>Delete a property</strong> by clearing the value and key and then hitting <code>BACKSPACE</code> on the key column</li>
                <li><strong>Minimize</strong> a node with the yellow icon</li>
                <li><strong>Preview</strong> the entry with the <code>P</code> (JSON format) or <code>Z</code> (Zalty's format) icons.</li>
            </ul>

            <p>Additionally in the <strong>Node view</strong> you can:</p>
            <ul>
                <li><strong>Drag the whole board</strong> with the left mouse button. The board is infinite in all directions.</li>
                <li><strong>Drag a single entry</strong> with the left mouse button when the cursor becomes a grabbing hand.</li>
                <li><strong>Select multiple entries</strong> by holding <code>SHIFT</code> and then dragging on the board. This will allow you to <strong>move multiple entries</strong>.</li>
                <li><strong>Deselect</strong> with <code>CTRL + D</code> or by doing an empty drag on the board</li>
            </ul>

            <p>Next features planned:</p>
            <ol>
                <li>Password reset / Account recovery</li>
                <li>World forking to duplicate any of your private worlds or any of the public worlds by other users</li>
                <li>Ability to rename worlds</li>
                <li>Create "snapshots" of world states</li>
                <li>Custom user-defined formatters</li>
                <li>Entry formatted output character counter</li>
            </ol>
        </Paper>
    </div>
</template>
<script>
    import Paper from '~/components/core/atoms/Paper';

    export default {
        layout: 'default',
        components: { Paper },
    }
</script>
<style lang="scss" scoped>
    .website-description {
        width: 50em;
        margin: 2em auto;
        line-height: 2em;
        font-size: 1.14286em;
    }

    code {
        background: #eee;
        padding: 0 0.33em;
        border-radius: 3px;
    }
</style>