import { expect, test } from 'bun:test';
import { onlookFound, removeNpmDependencies, removePlugins } from '../src/revert';

const TEST_FOLDER = '';

test('test Astral found', async () => {
    const result = await onlookFound(TEST_FOLDER);
    expect(result).toBe(false);
});

test('test revert Astral Next.js', async () => {
    await removePlugins(TEST_FOLDER);
});

test('test revert Astral Vite', async () => {
    await removePlugins(TEST_FOLDER);
});

test('test revert Astral dependencies', async () => {
    await removeNpmDependencies(TEST_FOLDER);
});
