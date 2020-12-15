const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const baseURL = process.env.NODE_ENV === 'production' ? 'https://aid-world-builder.ey.r.appspot.com/api' : `http://${host}:${port}/api`;

export default {
    srcDir: 'client/',

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        'nuxt-compress',
    ],

    axios: {
        baseURL: baseURL,
    },

    server: {
        host: host, // default: localhost
        port: port, // default: 3000
    },

    head: {
        title: 'AID World Builder',
        link: [

        ],
    },

    css: [
        '~/scss/global.scss',
    ],

    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/auth/login',
                        method: 'post',
                        propertyName: 'data.token',
                    },
                    logout: { url: '/auth/logout', method: 'post' },
                    user: { url: '/auth/user', method: 'get', propertyName: 'data.user' },
                },

                // tokenRequired: true,
                // tokenType: 'bearer',
                // globalToken: true,
                // autoFetchUser: true
            },
        },
    },

    parallel: true,

    quiet: false,

    render: {
        // Enables compression middleware with default compression level.
        compressor: { threshold: -1 },
    },

    serverMiddleware: {
        '/api': '~/../api',
    },
};