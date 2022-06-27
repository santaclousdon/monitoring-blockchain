module.exports = {
    transform: {'^.+\\.(t|j)sx?$': 'ts-jest'},
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        '/node_modules/(?!(@polkadot|@babel/runtime/helpers/esm/))'
    ]
};
