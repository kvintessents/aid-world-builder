const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safeTagsReplace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

module.exports = safeTagsReplace;
