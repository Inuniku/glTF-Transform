import { Document } from '@gltf-transform/core';
import { unlit } from '@gltf-transform/functions';
import test from 'ava';

test('basic', async (t) => {
	const document = new Document();
	document.createMaterial();
	await document.transform(unlit());
	const unlitExtension = document.getRoot().listExtensionsUsed()[0];
	t.is(unlitExtension.extensionName, 'KHR_materials_unlit', 'adds extension');
});
