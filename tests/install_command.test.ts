import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { InstallCommand } from '../src/commands/install_command.js';

const SKILL_REL = join('skills', 'aipostgen', 'SKILL.md');
const RESEARCH_REL = join('agents', 'research.md');
const REVIEW_REL = join('agents', 'review.md');
const STYLE_GUIDE = 'style_guide.md';

const tempDirs: string[] = [];

afterEach(() => {
	while (tempDirs.length > 0) {
		const dir = tempDirs.pop();
		if (dir !== undefined) {
			rmSync(dir, { recursive: true, force: true });
		}
	}
});

/** A throwaway project root with a `.claude` path, cleaned up after each test. */
function makeClaudeDir(): string {
	const root = mkdtempSync(join(tmpdir(), 'aipostgen-install-'));
	tempDirs.push(root);
	return join(root, '.claude');
}

describe('InstallCommand.install', () => {
	it('mirrors the Claude assets and seeds the sibling .aipostgen templates', () => {
		const claudeDir = makeClaudeDir();
		const result = InstallCommand.install(claudeDir, false);

		assert.equal(result.claudeDir, claudeDir);
		assert.equal(result.aipostgenDir, join(dirname(claudeDir), '.aipostgen'));

		assert.ok(result.claude.installed.includes(SKILL_REL));
		assert.ok(result.claude.installed.includes(RESEARCH_REL));
		assert.ok(result.claude.installed.includes(REVIEW_REL));
		assert.ok(result.aipostgen.installed.includes(STYLE_GUIDE));

		assert.ok(readFileSync(join(claudeDir, SKILL_REL), 'utf8').length > 0);
		assert.ok(readFileSync(join(result.aipostgenDir, STYLE_GUIDE), 'utf8').length > 0);
	});

	it('skips existing files without force, and re-copies the assets with it', () => {
		const claudeDir = makeClaudeDir();
		InstallCommand.install(claudeDir, false);

		const second = InstallCommand.install(claudeDir, false);
		assert.ok(second.claude.skipped.includes(SKILL_REL));
		assert.deepEqual(second.claude.installed, []);

		const forced = InstallCommand.install(claudeDir, true);
		assert.ok(forced.claude.installed.includes(SKILL_REL));
		assert.deepEqual(forced.claude.skipped, []);
	});

	it('never overwrites an existing .aipostgen template, even with force', () => {
		const claudeDir = makeClaudeDir();
		const aipostgenDir = join(dirname(claudeDir), '.aipostgen');
		const styleGuide = join(aipostgenDir, STYLE_GUIDE);
		mkdirSync(aipostgenDir, { recursive: true });
		writeFileSync(styleGuide, 'MY EDITED CONFIG');

		const first = InstallCommand.install(claudeDir, false);
		assert.ok(first.aipostgen.skipped.includes(STYLE_GUIDE));
		assert.equal(readFileSync(styleGuide, 'utf8'), 'MY EDITED CONFIG');

		const forced = InstallCommand.install(claudeDir, true);
		assert.ok(forced.aipostgen.skipped.includes(STYLE_GUIDE));
		assert.equal(readFileSync(styleGuide, 'utf8'), 'MY EDITED CONFIG');
	});
});
