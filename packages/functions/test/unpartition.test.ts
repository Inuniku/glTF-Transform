import { Document } from '@gltf-transform/core';
import { unpartition } from '@gltf-transform/functions';
import { logger } from '@gltf-transform/test-utils';
import test from 'ava';

test('basic', async (t) => {
	const document = new Document();
	const root = document.getRoot();
	const bufferA = document.createBuffer();
	const bufferB = document.createBuffer();
	const bufferC = document.createBuffer();
	const accessorA = document.createAccessor().setBuffer(bufferA);
	const accessorB = document.createAccessor().setBuffer(bufferB);
	const accessorC = document.createAccessor().setBuffer(bufferC);

	document.setLogger(logger);

	await document.transform(unpartition());

	t.is(root.listBuffers().length, 1, 'buffers.length === 1');
	t.falsy(bufferA.isDisposed(), 'buffersA live');
	t.truthy(bufferB.isDisposed(), 'buffersB disposed');
	t.truthy(bufferC.isDisposed(), 'buffersC disposed');
	t.is(accessorA.getBuffer(), bufferA, 'accessorA → bufferA');
	t.is(accessorB.getBuffer(), bufferA, 'accessorA → bufferA');
	t.is(accessorC.getBuffer(), bufferA, 'accessorA → bufferA');
});
