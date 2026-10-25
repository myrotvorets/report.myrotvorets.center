module.exports = async function manifestAssetsLoader(source) {
    const manifest = JSON.parse(source);

    await Promise.all(
        manifest.icons.map(async (icon) => {
            const asset = await this.importModule(icon.src);
            const url = typeof asset === 'string' ? asset : asset.default;
            if (typeof url !== 'string') {
                throw new Error(`Cannot resolve manifest icon: ${icon.src}`);
            }
            icon.src = url;
        }),
    );

    return JSON.stringify(manifest);
};
