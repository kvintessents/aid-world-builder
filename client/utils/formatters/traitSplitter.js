export default node => ({
    ...node,
    properties: node.properties.map(property => {
        const values = (
            property.value
            .split(',')
            .map(s => s.split('\n')).flat()
            .map(s => s.trim())
            .filter(s => s)
        );

        return {key: property.key, value: values}
    })
});