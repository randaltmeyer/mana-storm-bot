let _isDevMode;
export function isDevMode() {
    if (_isDevMode === undefined) {
        _isDevMode = process.argv.includes("--dev");
    }
    return _isDevMode;
}
//# sourceMappingURL=isDevMode.mjs.map