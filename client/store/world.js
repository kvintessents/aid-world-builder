import Vue from 'vue';

async function syncronizeState($axios, state) {
    const document = { ...state };

    // These value only exist in the front end
    delete document.syncingCalls;
    delete document.isOwner;

    const body = { document: JSON.stringify(document), version: Date.now(), isPublic: document.isPublic };

    return await $axios.post(`/world/${state.id}`, body);
}

function debounceFunction(fn, ms) {
    let timeout = null;
    let toResolve = [];
    let toReject = [];

    return async function(...args) {
        clearTimeout(timeout);

        return new Promise(async (resolve, reject) => {
            toResolve.push(resolve);
            toReject.push(reject);

            timeout = setTimeout(async () => {
                try {
                    const response = await fn(...args);

                    toResolve.map(resolveFn => resolveFn(response));
                    toResolve = [];
                } catch (e) {
                    toReject.map(rejectFn => rejectFn(e));
                    toReject = [];
                }
            }, ms);
        })
    }
}

const synchronize = debounceFunction(syncronizeState, 1000);

export const state = () => ({
    id: null,
    nodes: [],
    lastId: 0,
    syncingCalls: 0,
    isOwner: false,
    isNodeView: false,
    isPublic: false,
});

export const mutations = {
    setWorld(state, world) {
        const currentUserId = this.$auth.user && this.$auth.user.id;
        const document = JSON.parse(world.document);
        let index = 0;

        document.nodes = document.nodes.map(node => {
            return {
                size: null,
                minimized: false,
                selected: false,
                order: index++,
                ...node,
            }
        });
        Object.assign(state, document);
        state.id = world.id;
        state.isOwner = !!(currentUserId && world.user_id && (parseInt(world.user_id) === parseInt(currentUserId)));
    },
    addNode(state, position) {
        state.lastId += 1;

        if (!position) {
            position = { x: 0, y: 0 };
        }

        state.nodes.push(Vue.observable({
            id: state.lastId,
            randomId: `${Math.random()}`,
            position: position,
            zIndex: state.lastId,

            name: 'Meadow Hughes',
            tags: 'meadow, hughes, your sister',
            labels: [],
            size: null,
            minimized: false,
            selected: false,
            properties: [
                { key: "gender", value: "female" },
                { key: "hair color", value: "auburn" },
                { key: "hair length", value: "long" },
            ]
        }));
    },
    deleteNode(state, nodeToDelete) {
        state.nodes = state.nodes.filter(node => {
            return node !== nodeToDelete
        });
    },
    moveNodeBy(state, {node, position}) {
        const index = state.nodes.indexOf(node);
        state.nodes[index].position.x += position.x;
        state.nodes[index].position.y += position.y;

        for (const selectedNode of state.nodes) {
            if (selectedNode.selected && selectedNode !== node) {
                selectedNode.position.x += position.x;
                selectedNode.position.y += position.y;
            }
        }
    },
    setNodeSize(state, { node, size }) {
        const index = state.nodes.indexOf(node);
        state.nodes[index].size = Vue.observable({
            width: Math.max(size.width, 200),
            height: size.height
        });
    },
    setAttributes(state, { node, attributes }) {
        const index = state.nodes.indexOf(node);
        Object.assign(state.nodes[index], attributes);
    },
    addLabel(state, { node, label }) {
        const nodeIndex = state.nodes.indexOf(node);

        if (state.nodes[nodeIndex].labels.includes(label)) {
            return;
        }

        state.nodes[nodeIndex].labels.push(label);
    },
    removeLabel(state, { node, label }) {
        const nodeIndex = state.nodes.indexOf(node);
        const labelIndex = state.nodes[nodeIndex].labels.indexOf(label);

        if (labelIndex === -1) {
            return;
        }

        state.nodes[nodeIndex].labels.splice(labelIndex, 1);
    },
    startSync(state) {
        state.syncingCalls += 1;
    },
    stopSync(state) {
        state.syncingCalls -= 1;
    },
    setProperty(state, { node, index, value, key }) {
        const nodeIndex = state.nodes.indexOf(node);

        if (typeof value === 'string') {
            state.nodes[nodeIndex].properties[index].value = value;
        }

        if (typeof key === 'string') {
            state.nodes[nodeIndex].properties[index].key = key;
        }
    },
    appendNewProperty(state, { node, initValue }) {
        const index = state.nodes.indexOf(node);

        state.nodes[index].properties.push(initValue ? initValue : Vue.observable({key: '', value: ''}))
    },
    removeProperty(state, { node, propertyIndex }) {
        if (propertyIndex === undefined) {
            console.warn('Property Index undefined');
            return;
        }

        const index = state.nodes.indexOf(node)
        state.nodes[index].properties.splice(propertyIndex, 1);
    },
    sendToTop(state, node) {
        const index = state.nodes.indexOf(node);

        const highestValue = state.nodes.reduce((highest, node) => {
            return Math.max(highest, node.zIndex || 0);
        }, 0);

        state.nodes[index].zIndex = highestValue + 1;
    },
    minimizeNode(state, node) {
        const index = state.nodes.indexOf(node);

        state.nodes[index].minimized = !state.nodes[index].minimized;
    },
    selectNodes(state, selectedNodes) {
        for (const node of state.nodes) {
            if (selectedNodes.includes(node)) {
                node.selected = true;
            } else {
                node.selected = false;
            }
        }
    },
    clearSelection(state) {
        for (const node of state.nodes) {
            node.selected = false;
        }
    },
    setNodeView(state, isNodeView) {
        state.isNodeView = isNodeView;
    },
    setPublic(state, isPublic) {
        state.isPublic = isPublic;
    },
    duplicateNode(state, node) {
        const i = state.nodes.indexOf(node);
        const copy = JSON.parse(JSON.stringify(node));

        copy.id = ++state.lastId;
        copy.randomId = `${Math.random()}`;
        copy.name = `${copy.name} (copy)`;

        state.nodes = Vue.observable([
            ...state.nodes.slice(0, i + 1),
            Vue.observable(copy),
            ...state.nodes.slice(i + 1)
        ]);
    },
    reorderNode(state, { node, targetIndex }) {
        const currentIndex = state.nodes.indexOf(node);

        if (currentIndex === targetIndex) {
            return;
        }

        if (targetIndex === state.nodes.length) {
            state.nodes = state.nodes.filter(n => n !== node);
            state.nodes.push(node);
        } else {
            let left = state.nodes.slice(0, targetIndex).filter(n => n !== node);
            let right = state.nodes.slice(targetIndex).filter(n => n !== node);

            state.nodes = Vue.observable([ ...left, node, ...right ]);
        }

        // Updates order values
        state.nodes.forEach((n, i) => n.order = parseInt(i, 10));
    },
};

export const actions = {
    async addNode({ commit, dispatch }, position) {
        commit('addNode', position);
        dispatch('sync');
    },
    async deleteNode({ commit, dispatch }, arg) {
        commit('deleteNode', arg);
        dispatch('sync');
    },
    async setAttributes({ dispatch, commit }, { node, attributes }) {
        commit('setAttributes', { node, attributes });
        dispatch('sync');
    },
    async sync({ commit, state }) {
        if (!state.isOwner) {
            return;
        }

        commit('startSync');
        await synchronize(this.$axios, state);
        commit('stopSync');
    },
    async fetchWorld({ commit, state, auth, $auth }, id) {
        const result = await this.$axios.get(`worlds/${id}`);
        const world = result.data.data;
        commit('setWorld', world);
    },
    async moveNodeBy({ commit, dispatch }, args) {
        commit('moveNodeBy', args);
        dispatch('sync');
    },
    async setNodeSize({ commit, dispatch }, args) {
        commit('setNodeSize', args);
        dispatch('sync');
    },
    async setProperty({ commit, dispatch }, args) {
        commit('setProperty', args);
        dispatch('sync');
    },
    async sendToTop({ commit, dispatch }, args) {
        commit('sendToTop', args);
        dispatch('sync');
    },
    async removeProperty({ commit, dispatch }, args) {
        commit('removeProperty', args);
        dispatch('sync');
    },
    async minimizeNode({ commit, dispatch }, args) {
        commit('minimizeNode', args);
        dispatch('sync');
    },
    async setNodeView({ commit, dispatch }, args) {
        commit('setNodeView', args);
        dispatch('sync');
    },
    async setPublic({ commit, dispatch }, args) {
        commit('setPublic', args);
        dispatch('sync');
    },
    async duplicateNode({ commit, dispatch }, args) {
        commit('duplicateNode', args);
        dispatch('sync');
    },
    async reorderNode({ commit, dispatch }, args) {
        commit('reorderNode', args);
        dispatch('sync');
    },
}