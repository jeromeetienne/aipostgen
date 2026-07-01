import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RunStateSchema, type DraftState, type Entry, type Platform, type RunState } from './run_state.js';

const POSTS_DIR = 'posts';
const STATE_FILE = 'state.json';

export class RunStore {
	static create(entry: Entry, platforms: Platform[], slug: string, now: Date): { dir: string; state: RunState } {
		const dir = join(process.cwd(), POSTS_DIR, `${RunStore.stamp(now)}_${slug}`);
		mkdirSync(join(dir, 'assets'), { recursive: true });
		mkdirSync(join(dir, 'drafts'), { recursive: true });
		const state: RunState = {
			slug,
			createdAt: now.toISOString(),
			entry,
			platforms,
			postType: null,
			phase: entry.mode === 'fast' ? 'write' : 'research',
			angleApproved: false,
			drafts: platforms.map((platform): DraftState => ({ platform, status: 'pending', reviewRounds: 0 })),
			maxReviewRounds: 2,
		};
		RunStore.save(dir, state);
		return { dir, state };
	}

	static load(dir: string): RunState {
		return RunStateSchema.parse(JSON.parse(readFileSync(join(dir, STATE_FILE), 'utf8')));
	}

	static save(dir: string, state: RunState): void {
		writeFileSync(join(dir, STATE_FILE), `${JSON.stringify(state, null, 2)}\n`);
	}

	static rename(dir: string, slug: string): string {
		const state = RunStore.load(dir);
		const target = join(process.cwd(), POSTS_DIR, `${RunStore.stamp(new Date(state.createdAt))}_${slug}`);
		renameSync(dir, target);
		RunStore.save(target, { ...state, slug });
		return target;
	}

	static inProgress(): string[] {
		const base = join(process.cwd(), POSTS_DIR);
		if (existsSync(base) === false) {
			return [];
		}
		return readdirSync(base)
			.map((name) => join(base, name))
			.filter((dir) => existsSync(join(dir, STATE_FILE)) === true)
			.filter((dir) => RunStore.load(dir).phase !== 'done');
	}

	private static stamp(now: Date): string {
		const year = String(now.getUTCFullYear());
		const month = String(now.getUTCMonth() + 1).padStart(2, '0');
		const day = String(now.getUTCDate()).padStart(2, '0');
		return `${year}${month}${day}`;
	}
}
