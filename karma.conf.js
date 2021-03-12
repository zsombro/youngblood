module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'karma-typescript'],
        files: [
            'src/**/*.ts', // *.tsx for React Jsx
        ],
        preprocessors: {
            '**/*.ts': 'karma-typescript', // *.tsx for React Jsx
        },
        reporters: ['spec'],
        browsers: ['Firefox'],
        karmaTypescriptConfig: {
            compilerOptions: {
                module: 'commonjs',
                target: 'ES2015',
                lib: ['es5', 'es6', 'es2017', 'dom'],
            },
            tsconfig: './tsconfig.json',
        },
    });
};
