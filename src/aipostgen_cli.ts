import { Command } from 'commander';
import {
	EntryKindSchema,
	PlatformSchema,
	PostTypeSchema,
	type Platform,
	type RunState,
} from './run_state.js';
import { RunStore } from './run_store.js';
import { StateMachine } from './state_machine.js';

function print(value: unknown): void {
	console.log(JSON.stringify(value, null, 2));
}

function parsePlatforms(list: string): Platform[] {
	return list.split(',').map((item) => PlatformSchema.parse(item.trim()));
}

function transition(dir: string, change: (state: RunState) => RunState): void {
	const next = change(RunStore.load(dir));
	RunStore.save(dir, next);
	print(next);
}

const program = new Command();
program.name('aipostgen').description('Drives a social post run through its phases.');

program
	.command('start')
	.requiredOption('--kind <kind>', 'url, repo, or text')
	.requiredOption('--value <value>', 'the url, repo path, or text')
	.requiredOption('--slug <slug>', 'provisional slug')
	.option('--platforms <list>', 'comma-separated platforms', 'x,bsky,linkedin')
	.action((opts: Record<string, string>) => {
		const entry = { kind: EntryKindSchema.parse(opts.kind), value: opts.value };
		print(RunStore.create(entry, parsePlatforms(opts.platforms), opts.slug, new Date()));
	});

program
	.command('status')
	.requiredOption('--dir <dir>')
	.action((opts: Record<string, string>) => print(RunStore.load(opts.dir)));

program
	.command('next')
	.requiredOption('--dir <dir>')
	.action((opts: Record<string, string>) => print(StateMachine.nextAction(RunStore.load(opts.dir))));

program
	.command('set-research')
	.requiredOption('--dir <dir>')
	.requiredOption('--post-type <type>', 'result, capability, opinion, or casual')
	.action((opts: Record<string, string>) =>
		transition(opts.dir, (state) => StateMachine.afterResearch(state, PostTypeSchema.parse(opts.postType))),
	);

program
	.command('approve-angle')
	.requiredOption('--dir <dir>')
	.action((opts: Record<string, string>) => transition(opts.dir, (state) => StateMachine.approveAngle(state)));

program
	.command('redirect-angle')
	.requiredOption('--dir <dir>')
	.action((opts: Record<string, string>) => transition(opts.dir, (state) => StateMachine.redirectAngle(state)));

program
	.command('after-assets')
	.requiredOption('--dir <dir>')
	.action((opts: Record<string, string>) => transition(opts.dir, (state) => StateMachine.afterAssets(state)));

program
	.command('mark-drafted')
	.requiredOption('--dir <dir>')
	.requiredOption('--platform <platform>')
	.action((opts: Record<string, string>) =>
		transition(opts.dir, (state) => StateMachine.markDrafted(state, PlatformSchema.parse(opts.platform))),
	);

program
	.command('record-review')
	.requiredOption('--dir <dir>')
	.requiredOption('--platform <platform>')
	.requiredOption('--verdict <verdict>', 'pass or revise')
	.action((opts: Record<string, string>) =>
		transition(opts.dir, (state) =>
			StateMachine.recordReview(state, PlatformSchema.parse(opts.platform), opts.verdict === 'pass'),
		),
	);

program
	.command('approve-draft')
	.requiredOption('--dir <dir>')
	.requiredOption('--platform <platform>')
	.action((opts: Record<string, string>) =>
		transition(opts.dir, (state) => StateMachine.approveDraft(state, PlatformSchema.parse(opts.platform))),
	);

program
	.command('edit-draft')
	.requiredOption('--dir <dir>')
	.requiredOption('--platform <platform>')
	.action((opts: Record<string, string>) =>
		transition(opts.dir, (state) => StateMachine.editDraft(state, PlatformSchema.parse(opts.platform))),
	);

program
	.command('rename')
	.requiredOption('--dir <dir>')
	.requiredOption('--slug <slug>')
	.action((opts: Record<string, string>) => print({ dir: RunStore.rename(opts.dir, opts.slug) }));

program
	.command('list')
	.description('in-progress runs, for resume')
	.action(() => print(RunStore.inProgress()));

program.parse();
