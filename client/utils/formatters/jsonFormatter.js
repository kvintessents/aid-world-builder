import traitSplitter from '~/utils/formatters/traitSplitter';

function getEntry(node) {
    return [{
        [node.name]: node.properties.reduce((acc, property) => {
            acc[property.key] = property.value;
            return acc;
        }, {}),
    }];
}
export default (node, { isPreview }) => ({
    id: node.randomId,
    keys: node.tags,
    entry: isPreview ? getEntry(traitSplitter(node)) : JSON.stringify(getEntry(traitSplitter(node))),
    isNotHidden: true,
});
