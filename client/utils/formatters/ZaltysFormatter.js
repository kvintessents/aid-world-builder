import traitSplitter from '~/utils/formatters/traitSplitter';

function getEntry(node) {
    const traits = node.properties.map(trait => {
        const values = trait.value.join('/');
        const key = trait.key.trim().toUpperCase();

        if (!key) {
            return values;
        }

        return `${key}<${node.name}>:${values}`;
    }).join(';');

    return `${node.name}:[${traits}.]`;
}

export default node => ({
    id: node.randomId,
    keys: node.tags,
    entry: getEntry(traitSplitter(node)),
    isNotHidden: true,
});
