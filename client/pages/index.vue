<template>
    <div>
        <Paper padded-2 class="website-description">
            <p style="color:red;">This website is in very very VERY alpha stages - I've worked on this project for less than a week! If you create a user and world, I cannot guarantee that they won't be deleted at some point, so see yourself as an alpha tester.</p>
            <h2>AID World Builder</h2>
            <p>The purpose of this builder is to help you create World Info entries in <strong>JSON format</strong>. Create your characters and locations as nodes, download the generated World Info file and upload it to AIDungeon.</p>
            <ol>
                <li>Register an account with your email</li>
                <li>Go to Your Worlds</li>
                <li>Create a new world by entering the name in the text box and submitting</li>
                <li>Click on the new world, create some entries and download</li>
            </ol>

            <p>The UI is not yet very beginner friendly, but here is how you can do things:</p>
            <ul>
                <li><strong>Drag the whole board</strong> with the left mouse button. The board is infinite in all directions.</li>
                <li><strong>Drag a single entry</strong> with the left mouse button when the cursor becomes a grabbing hand.</li>
                <li><strong>Select multiple entries</strong> by holding <code>SHIFT</code> and then dragging on the board. This will allow you to <strong>move multiple entries</strong>.</li>
                <li><strong>Deselect</strong> with <code>CTRL + D</code> or by doing an empty drag on the board</li>
                <li><strong>Create a new property</strong> by hitting <code>TAB</code> on the value field of the last row.</li>
                <li><strong>Delete a property</strong> by clearing the value and key and then hitting <code>BACKSPACE</code> on the key column</li>
                <li><strong>Minimize</strong> a node with the yellow icon</li>
                <li><strong>Preview</strong> the entry in JSON format by clicking the little <code>P</code> if you know what I mean. The preview will be more readable than the downloaded save file, since that will be further stringifed and escaped.</li>
            </ul>
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