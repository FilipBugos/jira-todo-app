'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { LabelSelectField } from '@/components/form-fields/label-select-field';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { LabelInputField } from '@/components/form-fields/label-input-field';
import { createSprint } from '@/actions/sprintActions';
import { assignIssueToSprint } from '@/actions/issueActions';
import { assignCurrentSprint } from '@/actions/projectActions';

import { type InsertSprint, type SelectIssue } from '../../../../../db/schema';

type CreateSprintDialogType = {
	trigger: React.ReactNode;
	issues: SelectIssue[];
	projectId: number;
	newSprintNumber: number;
};

const formSchema = z.object({
	issues: z
		.array(z.string())
		.min(1, { message: 'Sprint has to contain at least one issue' }),
	enddate: z
		.string()
		.min(1, { message: 'End date has to be inserted.' })
		.transform(str => new Date(str))
		.refine(date => date > new Date(Date.now()), 'The date must be after today')
});

export type CreateSprintSchema = z.infer<typeof formSchema>;

const CreateIssueDialog = ({
	trigger,
	issues,
	projectId,
	newSprintNumber
}: CreateSprintDialogType) => {
	const router = useRouter();
	const form = useForm<CreateSprintSchema>({
		resolver: zodResolver(formSchema)
	});

	const reset = () => {
		form.resetField('issues');
	};

	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	async function submit() {
		await form
			.handleSubmit(
				async values => {
					const sprintEntity: InsertSprint = {
						Name: `Sprint ${newSprintNumber}`,
						Project: projectId,
						StartDate: new Date(),
						EndDate: values.enddate
					};

					try {
						// todo: do it transactional
						// create new sprint
						const sprintResult = await createSprint(sprintEntity);
						// update issues
						values.issues.forEach(async issueId => {
							await assignIssueToSprint(
								Number(issueId),
								sprintResult.at(0)?.id
							);
						});
						// update project current sprint id
						await assignCurrentSprint(projectId, sprintResult.at(0)?.id);

						toast.success('Sprint has started.');
						reset();
						router.refresh();
						document.getElementById('closeDialogBtn')?.click();
					} catch (e) {
						if (e instanceof Error) {
							toast.error(e.message);
						}
					}
				},
				e => {
					console.log(e);
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
								{`Create Sprint ${newSprintNumber}`}
							</DialogTitle>
							<div>
								<label>{`Sprint ${newSprintNumber}`}</label>
							</div>
							<div className="mt-2 flex flex-col gap-4">
								<LabelSelectField
									label="Issues"
									multiple
									name="issues"
									data={issues.map(issue => ({
										key: issue.ID,
										value: issue.Summary
									}))}
									className="min-h-[230px] min-w-[230px] flex-grow rounded-md p-2"
									onChange={selectedOption => {
										// const selectedProject = Number(selectedOption.target.value);
										// setSelectedProject(selectedProject);
										// setSprintsToSelect(
										// 	sprints.filter(s => s.Project === selectedProject)
										// );
									}}
									// value={selectedProject}
									defaultValue=""
								/>
								<LabelInputField type="date" label="End Date" name="enddate" />
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
