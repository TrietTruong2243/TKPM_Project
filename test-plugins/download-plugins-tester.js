function runPluginTest(pluginInstance,sourceInstances, pluginFile) {
	test.concurrent(`properties (${pluginFile}) `, async () => {
		expect(pluginInstance).toHaveProperty("image");
		expect(pluginInstance).toHaveProperty("extension");
	});
	for (const sourceInstance of sourceInstances) {
		console.log(sourceInstance)
		describe(`Testing Plugin ${pluginFile} with source ${sourceInstance.name}`, () => {

			test.concurrent("is-not-empty",()=>{
				// const buffer = await pluginInstance.getBuffer('source', 'novel_slug', 'chapter_slug');
				expect(buffer.length).toBeGreaterThan(0);
			})

		});
	}

}

export default runPluginTest;
