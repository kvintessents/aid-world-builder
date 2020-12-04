function getEntry(node) {
    return [{
        [node.name]: node.properties.reduce((acc, property) => {
            acc[property.key] = property.value
            return acc;
        }, {})
    }]
}
export default (node, { isPreview }) => ({
    id: node.randomId,
    keys: node.tags,
    entry: isPreview ? getEntry(node) : JSON.stringify(getEntry(node)),
    isNotHidden: true
})