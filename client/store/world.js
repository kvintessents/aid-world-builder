async function syncronizeState($axios, state) {
    const document = { ...state };
    delete document.syncingCalls;

    const body = { document: JSON.stringify(document), version: Date.now() };

    console.log(body);

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
        console.log('Setting world', world);
        Object.assign(state, world);
    },
    addNode(state, position) {
        state.lastId += 1;

        if (!position) {
            position = { x: 0, y: 0 };
        }

        state.nodes.push({
            id: state.lastId,
            position: position,

            name: 'Meadow Hughes',
            tags: 'meadow, hughes, your sister',
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
    setAttributes(state, { node, attributes }) {
        const index = state.nodes.indexOf(node);
        Object.assign(state.nodes[index], attributes);
    },
    startSync(state) {
        state.syncingCalls += 1;
    },
    stopSync(state) {
        state.syncingCalls -= 1;
    },
    setProperty(state, { node, index, value, key }) {
        const nodeIndex = state.nodes.indexOf(node);

        if (value) {
            state.nodes[nodeIndex].properties[index].value = value;
        }

        if (key) {
            state.nodes[nodeIndex].properties[index].key = key;
        }
    }
};

export const actions = {
    async addNode({ commit, dispatch }, position) {
        commit('addNode', position);
        dispatch('sync');
    },
    async setAttributes({ dispatch, commit }, { node, attributes }) {
        console.log('asdasdasd')
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
        commit('setWorld', JSON.parse(world.document));
    },
    async setNodePosition({ commit, dispatch }, args) {
        commit('setNodePosition', args);
        dispatch('sync');
    },
    async setProperty({ commit, dispatch }, args) {
        commit('setProperty', args);
        dispatch('sync');
    },
}