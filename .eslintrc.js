module.exports = {
    "extends": ["airbnb-base", "plugin:flowtype/recommended"],
    "plugins": ["flowtype"],
    "settings": {
        "import/resolver": {
            "node": {
                "moduleDirectory": ["node_modules", "src/"]
            }
        }
    },
    "rules": {
        "consistent-return": 0,
        "import/prefer-default-export": 0,
        "no-console": 0,
        "camelcase": 0,
        "arrow-body-style": 0,
        "class-methods-use-this": 0,
        "no-plusplus": 0,
    }
};