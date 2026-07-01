import { z } from 'zod';

export const PlatformSchema = z.enum(['x', 'bsky', 'linkedin']);
export type Platform = z.infer<typeof PlatformSchema>;

export const EntryModeSchema = z.enum(['fast', 'research']);
export type EntryMode = z.infer<typeof EntryModeSchema>;

export const PostTypeSchema = z.enum(['result', 'capability', 'opinion', 'casual']);
export type PostType = z.infer<typeof PostTypeSchema>;

export const PhaseSchema = z.enum([
	'research',
	'angle_gate',
	'assets',
	'write',
	'review',
	'approve',
	'done',
]);
export type Phase = z.infer<typeof PhaseSchema>;

export const DraftStatusSchema = z.enum([
	'pending',
	'drafted',
	'revising',
	'passed',
	'approved',
]);
export type DraftStatus = z.infer<typeof DraftStatusSchema>;

export const EntrySchema = z.object({
	mode: EntryModeSchema,
	value: z.string().min(1),
});
export type Entry = z.infer<typeof EntrySchema>;

export const DraftStateSchema = z.object({
	platform: PlatformSchema,
	status: DraftStatusSchema,
	reviewRounds: z.number().int().min(0),
});
export type DraftState = z.infer<typeof DraftStateSchema>;

export const RunStateSchema = z.object({
	slug: z.string().min(1),
	createdAt: z.string(),
	entry: EntrySchema,
	platforms: z.array(PlatformSchema).min(1),
	postType: PostTypeSchema.nullable(),
	phase: PhaseSchema,
	angleApproved: z.boolean(),
	drafts: z.array(DraftStateSchema),
	maxReviewRounds: z.number().int().min(1),
});
export type RunState = z.infer<typeof RunStateSchema>;
