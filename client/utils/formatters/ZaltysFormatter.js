function getEntry(node) {
    const traits = node.properties.map(trait => {
        const values = trait.value.split(',').map(s => s.trim()).join('/');
        const key = trait.key.trim().toUpperCase();

        if (!key) {
            return values;
        }

        return `${key}<${node.name}>:${values}`;
    }).join(';');

    return `${node.name}:[${traits}]`
}
export default (node, { isPreview }) => ({
    id: node.randomId,
    keys: node.tags,
    entry: getEntry(node),
    isNotHidden: true
})