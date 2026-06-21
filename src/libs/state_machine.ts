import {
	type DraftState,
	type DraftStatus,
	type Platform,
	type PostType,
	type RunState,
} from './run_state.js';

export type Action =
	| { kind: 'research' }
	| { kind: 'await_angle' }
	| { kind: 'assets' }
	| { kind: 'write'; platforms: Platform[] }
	| { kind: 'review'; platforms: Platform[] }
	| { kind: 'await_approval'; platforms: Platform[] }
	| { kind: 'done' };

export class StateMachine {
	static nextAction(state: RunState): Action {
		if (state.phase === 'research') {
			return { kind: 'research' };
		}
		if (state.phase === 'angle_gate') {
			return { kind: 'await_angle' };
		}
		if (state.phase === 'assets') {
			return { kind: 'assets' };
		}
		if (state.phase === 'write') {
			return { kind: 'write', platforms: StateMachine.pendingWrite(state) };
		}
		if (state.phase === 'review') {
			return { kind: 'review', platforms: StateMachine.pendingReview(state) };
		}
		if (state.phase === 'approve') {
			return { kind: 'await_approval', platforms: StateMachine.readyForApproval(state) };
		}
		return { kind: 'done' };
	}

	static afterResearch(state: RunState, postType: PostType): RunState {
		return { ...state, postType, phase: 'angle_gate' };
	}

	static approveAngle(state: RunState): RunState {
		return { ...state, angleApproved: true, phase: 'assets' };
	}

	static redirectAngle(state: RunState): RunState {
		return { ...state, phase: 'research' };
	}

	static afterAssets(state: RunState): RunState {
		return { ...state, phase: 'write' };
	}

	static markDrafted(state: RunState, platform: Platform): RunState {
		return StateMachine.recomputeWorkPhase(StateMachine.setStatus(state, platform, 'drafted'));
	}

	static recordReview(state: RunState, platform: Platform, passed: boolean): RunState {
		const drafts = state.drafts.map((draft): DraftState => {
			if (draft.platform !== platform) {
				return draft;
			}
			if (passed === true) {
				return { ...draft, status: 'passed' };
			}
			return { ...draft, status: 'revising', reviewRounds: draft.reviewRounds + 1 };
		});
		return StateMachine.recomputeWorkPhase({ ...state, drafts });
	}

	static approveDraft(state: RunState, platform: Platform): RunState {
		return StateMachine.recomputeWorkPhase(StateMachine.setStatus(state, platform, 'approved'));
	}

	static editDraft(state: RunState, platform: Platform): RunState {
		return StateMachine.recomputeWorkPhase(StateMachine.setStatus(state, platform, 'drafted'));
	}

	private static setStatus(state: RunState, platform: Platform, status: DraftStatus): RunState {
		const drafts = state.drafts.map((draft): DraftState =>
			draft.platform === platform ? { ...draft, status } : draft,
		);
		return { ...state, drafts };
	}

	private static recomputeWorkPhase(state: RunState): RunState {
		const needsWrite = state.drafts.some(
			(draft) =>
				draft.status === 'pending' ||
				(draft.status === 'revising' && draft.reviewRounds < state.maxReviewRounds),
		);
		if (needsWrite === true) {
			return { ...state, phase: 'write' };
		}
		const needsReview = state.drafts.some((draft) => draft.status === 'drafted');
		if (needsReview === true) {
			return { ...state, phase: 'review' };
		}
		const allApproved = state.drafts.every((draft) => draft.status === 'approved');
		if (allApproved === true) {
			return { ...state, phase: 'done' };
		}
		return { ...state, phase: 'approve' };
	}

	private static pendingWrite(state: RunState): Platform[] {
		return state.drafts
			.filter(
				(draft) =>
					draft.status === 'pending' ||
					(draft.status === 'revising' && draft.reviewRounds < state.maxReviewRounds),
			)
			.map((draft) => draft.platform);
	}

	private static pendingReview(state: RunState): Platform[] {
		return state.drafts.filter((draft) => draft.status === 'drafted').map((draft) => draft.platform);
	}

	private static readyForApproval(state: RunState): Platform[] {
		return state.drafts
			.filter(
				(draft) =>
					draft.status === 'passed' ||
					(draft.status === 'revising' && draft.reviewRounds >= state.maxReviewRounds),
			)
			.map((draft) => draft.platform);
	}
}
