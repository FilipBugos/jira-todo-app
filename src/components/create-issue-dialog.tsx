'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { type ProjectsWithUsers } from '@/actions/projectActions';
import { getLabels, getStatuses } from '@/lib/utils';
import { createIssue } from '@/actions/issueActions';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';

import {
	type InsertIssue,
	type SelectSprint,
	type SelectUser
} from '../../db/schema';

import { LabelInputField } from './form-fields/label-input-field';
import { LabelSelectField } from './form-fields/label-select-field';

type CreateIssueDialogType = {
	projects: ProjectsWithUsers[];
	trigger: React.ReactNode;
	sprints: SelectSprint[];
	user: SelectUser;
};

const formSchema = z.object({
	project: z
		.string()
		.min(1, { message: 'Project must be selected' })
		.transform(Number)
		.default(''),
	summary: z
		.string()
		.min(3, { message: 'Issue has to contain summary.' })
		.default(''),
	description: z.string().optional().default(''),
	sprint: z.string().transform(Number).optional().default(''),
	label: z.string().optional().transform(Number).default(''),
	assignee: z.string().optional().default(''),
	storyPoints: z.string().optional().transform(Number).default('')
});

export type CreateIssueSchema = z.infer<typeof formSchema>;

const CreateIssueDialog = ({
	projects,
	trigger,
	sprints,
	user
}: CreateIssueDialogType) => {
	const [selectedProject, setSelectedProject] = useState<number>();
	const [sprintsToSelect, setSprintsToSelect] = useState<SelectSprint[]>([]);
	const router = useRouter();

	const form = useForm<CreateIssueSchema>({
		resolver: zodResolver(formSchema)
	});

	console.log('Sprint to select', sprintsToSelect);

	const reset = () => {
		form.resetField('project');
		form.resetField('summary');
		form.resetField('description');
		form.resetField('sprint');
		form.resetField('label');
		form.resetField('assignee');
		form.resetField('storyPoints');
	};

	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	async function submit() {
		await form
			.handleSubmit(
				async issue => {
					const issueEntity: InsertIssue = {
						CreatedBy: user.id,
						ProjectID: issue.project,
						Description: issue.description ?? null,
						Summary: issue.summary,
						Estimation: issue.storyPoints,
						CreatedTime: new Date(),
						Label: issue.label,
						Status: getStatuses().at(0)?.Name,
						...(issue.sprint && { SprintID: issue.sprint }),
						...(issue.assignee && { AssignedTo: issue.assignee })
					};

					try {
						await createIssue(issueEntity);
						toast.success('Issue was successfully created');
						reset();
						router.refresh();
						document.getElementById('closeDialogBtn')?.click();
					} catch (e) {
						if (e instanceof Error) {
							toast.error(e.message);
						}
					}
				},
				() => {
					toast.error('Validation error, correct non-valid fields.');
				}
			)
			.call();
	}

	return (
		<FormProvider {...form}>
			<form>
				<div className="">
					<Dialog onOpenChange={reset}>
						<DialogTrigger asChild>{trigger}</DialogTrigger>
						<DialogContent
							onInteractOutside={e => {
								e.preventDefault();
							}}
							className="DialogContent w-6/12 bg-slate-300"
						>
							<DialogTitle className="DialogTitle mb-5 text-xl">
								Create Issue
							</DialogTitle>
							<div className="mt-2 flex flex-col gap-4">
								<LabelSelectField
									label="Project"
									name="project"
									data={projects.map(p => ({
										key: p.project?.ID,
										value: p.project?.Name
									}))}
									className="min-w-[230px] flex-grow rounded-md p-2"
									onChange={selectedOption => {
										const selectedProject = Number(selectedOption.target.value);
										setSelectedProject(selectedProject);
										setSprintsToSelect(
											sprints.filter(s => s.Project === selectedProject)
										);
									}}
									value={selectedProject}
									defaultValue=""
								/>
								<LabelInputField label="Summary" name="summary" type="text" />
								<LabelInputField
									label="Story points"
									name="storyPoints"
									type="number"
								/>

								<LabelSelectField
									label="Sprint"
									name="sprint"
									data={sprintsToSelect.map(s => ({
										key: s.ID,
										value: s.Name
									}))}
									className="min-w-[230px] flex-grow rounded-md p-2"
								/>
								<LabelSelectField
									label="Label"
									name="label"
									data={getLabels().map(l => ({ key: l.ID, value: l.Name }))}
									className="min-w-[230px] flex-grow rounded-md p-2"
								/>
								<LabelSelectField
									label="Assignee"
									name="assignee"
									data={projects
										.filter(
											p =>
												p.project?.ID === selectedProject && p.project.Members
										)
										.map(p => [...p.project.Members])
										.flat()
										.map(u => ({
											key: u.User.id,
											value: u.User.name
										}))}
									className="min-w-[230px] flex-grow rounded-md p-2"
								/>
								<div className="grid grid-cols-2 grid-rows-5">
									<label>Description</label>
									<textarea
										{...form.register('description')}
										className="row-span-5 min-w-[180px] flex-grow rounded-md p-2"
										placeholder="Enter description..."
									/>
								</div>
							</div>
							<DialogFooter>
								<div className="flex flex-row-reverse gap-10">
									<button className="flex-end" onClick={() => submit()}>
										Save changes
									</button>
									<DialogClose asChild>
										<button
											id="closeDialogBtn"
											onClick={() => {
												reset();
											}}
											className="flex-end"
										>
											Close
										</button>
									</DialogClose>
								</div>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</form>
		</FormProvider>
	);
};

export default CreateIssueDialog;
