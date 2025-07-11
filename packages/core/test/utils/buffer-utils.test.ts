import { BufferUtils } from '@gltf-transform/core';
import test from 'ava';

const IS_NODEJS = typeof window === 'undefined';

const HELLO_WORLD = 'data:application/octet-stream;base64,aGVsbG8gd29ybGQ=';

test('web', (t) => {
	if (IS_NODEJS) return t.pass();
	t.is(
		BufferUtils.decodeText(BufferUtils.createBufferFromDataURI(HELLO_WORLD)),
		'hello world',
		'createBufferFromDataURI',
	);
	t.is(BufferUtils.decodeText(BufferUtils.encodeText('hey')), 'hey', 'encode/decode');
});

test('node.js', (t) => {
	if (!IS_NODEJS) return t.pass();
	t.is(
		BufferUtils.decodeText(BufferUtils.createBufferFromDataURI(HELLO_WORLD)),
		'hello world',
		'createBufferFromDataURI',
	);
	t.is(BufferUtils.decodeText(BufferUtils.encodeText('hey')), 'hey', 'encode/decode');

	const buffer = new Uint8Array([1, 2]);
	t.is(BufferUtils.equals(buffer, buffer), true, 'equals strict');
	t.is(BufferUtils.equals(buffer, new Uint8Array([1])), false, 'equals by length');
});
