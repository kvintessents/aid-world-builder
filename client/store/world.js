import Vue from 'vue';

async function syncronizeState($axios, state) {
    const document = { ...state };
    delete document.syncingCalls;

    const body = { document: JSON.stringify(document), version: Date.now() };

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
            }, ms)
        })
    }
}

const synchronize = debounceFunction(syncronizeState, 1000);

export const state = () => ({
    id: null,
    nodes: [],
    lastId: 0,
    syncingCalls: 0,
});

export const mutations = {
    setWorld(state, world) {
        const document = JSON.parse(world.document);
        document.nodes = document.nodes.map(node => {
            return {
                size: null,
                ...node,
            }
        });
        Object.assign(state, document);
        state.id = world.id;
    },
    addNode(state, position, size) {
        state.lastId += 1;

        if (!position) {
            position = { x: 0, y: 0 };
        }

        state.nodes.push({
            id: state.lastId,
            randomId: `${Math.random()}`,
            position: position,

            name: 'Meadow Hughes',
            tags: 'meadow, hughes, your sister',
            labels: [],
            size: null,
            properties: [
                { key: "gender", value: "female" },
                { key: "hair color", value: "auburn" },
                { key: "hair length", value: "long" },
            ]
        });
    },
    setNodePosition(state, {node, position}) {
        const index = state.nodes.indexOf(node);
        state.nodes[index].position.x = position.x;
        state.nodes[index].position.y = position.y;
    },
    setNodeSize(state, { node, size }) {
        const index = state.nodes.indexOf(node);
        state.nodes[index].size = Vue.observable({
            width: Math.max(size.width, 200),
            height: Math.max(size.height, 200),
        });
    },
    removeNodeSize(state, node) {
        const index = state.nodes.indexOf(node);
        state.nodes[index].size = null;
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
    appendNewProperty(state, node) {
        const index = state.nodes.indexOf(node);

        state.nodes[index].properties.push({key: '', value: ''})
    },
    removeProperty(state, { node, propertyIndex }) {
        if (propertyIndex === undefined) {
            console.warn('Property Index undefined');
            return;
        }

        const index = state.nodes.indexOf(node)
        state.nodes[index].properties.splice(propertyIndex, 1);
    }
};

export const actions = {
    async addNode({ commit, dispatch }, position) {
        commit('addNode', position);
        dispatch('sync');
    },
    async setAttributes({ dispatch, commit }, { node, attributes }) {
        commit('setAttributes', { node, attributes });
        dispatch('sync');
    },
    async sync({ commit, state }) {
        commit('startSync');
        await synchronize(this.$axios, state);
        commit('stopSync');
    },
    async fetchWorld({ commit, state }, id) {
        const result = await this.$axios.get(`worlds/${id}`);
        const world = result.data.data;
        commit('setWorld', world);
    },
    async setNodePosition({ commit, dispatch }, args) {
        commit('setNodePosition', args);
        dispatch('sync');
    },
    async setNodeSize({ commit, dispatch }, args) {
        commit('setNodeSize', args);
        dispatch('sync');
    },
    async removeNodeSize({ commit, dispatch }, args) {
        commit('removeNodeSize', args);
        dispatch('sync');
    },
    async setProperty({ commit, dispatch }, args) {
        commit('setProperty', args);
        dispatch('sync');
    },
    async removeProperty({ commit, dispatch }, args) {
        commit('removeProperty', args);
        // dispatch('sync');
    },
}