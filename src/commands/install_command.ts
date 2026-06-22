import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { PROJECT_ROOT } from '../project_root.js';

/** Folder of bundled Claude Code assets (the skill and agents) mirrored into `.claude/`. */
const CLAUDE_SOURCE_DIR = 'dotclaude_folder';

/** Folder of bundled reference-file templates seeded into `.aipostgen/`. */
const AIPOSTGEN_SOURCE_DIR = 'dotaipostgen_folder';

/** Name of the reference-file directory, a sibling of the target `.claude/`. */
const AIPOSTGEN_DIR_NAME = '.aipostgen';

/**
 * Relative paths under a source folder that document the folder itself and must
 * not be installed. A folder's own `README.md` explains the folder; it is not a
 * Claude Code asset or a reference file.
 */
const EXCLUDED_RELATIVE_PATHS = new Set<string>(['README.md']);

/** Per-target outcome: the relative paths written, and those left in place. */
export type MirrorResult = {
	installed: string[];
	skipped: string[];
};

/** Summary returned by {@link InstallCommand.install}. */
export type InstallResult = {
	claudeDir: string;
	claude: MirrorResult;
	aipostgenDir: string;
	aipostgen: MirrorResult;
};

/**
 * Installs the bundled Claude Code assets — the `/aipostgen` skill and the
 * `research` / `review` agents under `dotclaude_folder/` — into a target `.claude/`
 * directory, and seeds the `.aipostgen/` reference-file templates beside it.
 */
export class InstallCommand {
	/**
	 * Mirror the bundled assets into `claudeDestination`, which *is* the target
	 * `.claude` directory. Reference-file templates are seeded into the sibling
	 * `.aipostgen/` directory.
	 *
	 * @param claudeDestination The `.claude` directory to write the assets into.
	 * @param force Overwrite existing Claude-asset files. This never affects the
	 *   `.aipostgen/` templates, which are only ever written when absent so an
	 *   edited configuration is preserved.
	 * @returns The resolved destinations and the per-target outcome.
	 */
	static install(claudeDestination: string, force: boolean): InstallResult {
		const claudeSource = resolve(PROJECT_ROOT, CLAUDE_SOURCE_DIR);
		const aipostgenSource = resolve(PROJECT_ROOT, AIPOSTGEN_SOURCE_DIR);
		InstallCommand.requireDir(claudeSource);
		InstallCommand.requireDir(aipostgenSource);

		const claudeDir = resolve(claudeDestination);
		const aipostgenDir = resolve(claudeDir, '..', AIPOSTGEN_DIR_NAME);

		return {
			claudeDir,
			claude: InstallCommand.mirror(claudeSource, claudeDir, force),
			aipostgenDir,
			aipostgen: InstallCommand.mirror(aipostgenSource, aipostgenDir, false),
		};
	}

	/**
	 * Copies every file under `sourceRoot` into `targetRoot`, preserving the
	 * relative tree, except documentation files in {@link EXCLUDED_RELATIVE_PATHS}.
	 * An existing file is overwritten only when `overwrite` is true; otherwise it is
	 * left untouched and reported as skipped. Returns the relative paths written and
	 * those skipped.
	 */
	static mirror(sourceRoot: string, targetRoot: string, overwrite: boolean): MirrorResult {
		const installed: string[] = [];
		const skipped: string[] = [];

		for (const source of InstallCommand.collectFiles(sourceRoot)) {
			const rel = relative(sourceRoot, source);
			if (EXCLUDED_RELATIVE_PATHS.has(rel) === true) {
				continue;
			}

			const target = join(targetRoot, rel);
			if (existsSync(target) === true && overwrite === false) {
				skipped.push(rel);
				continue;
			}

			mkdirSync(dirname(target), { recursive: true });
			copyFileSync(source, target);
			installed.push(rel);
		}

		return { installed, skipped };
	}

	/** Recursively collects every file path under a directory, depth-first. */
	private static collectFiles(dir: string): string[] {
		const files: string[] = [];
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = join(dir, entry.name);
			if (entry.isDirectory() === true) {
				files.push(...InstallCommand.collectFiles(full));
				continue;
			}
			if (entry.isFile() === true) {
				files.push(full);
			}
		}
		return files;
	}

	/** Throws when a required bundled source folder is missing. */
	private static requireDir(dir: string): void {
		if (existsSync(dir) === false) {
			throw new Error(`bundled assets not found at ${dir}`);
		}
	}
}
