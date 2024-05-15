'use client';

import { FormProvider, useForm } from 'react-hook-form';
import React, { useState } from 'react';

import { updateIssue } from '@/actions/issueActions';
import EditableText from '@/components/form-fields/editable-text';
import { LabelSelectField } from '@/components/form-fields/label-select-field';
import { type SprintsWithUsers } from '@/actions/sprintActions';
import { type ProjectsWithUsers } from '@/actions/projectActions';
import { getLabels } from '@/lib/utils';

import {
	type InsertIssue,
	type SelectIssue,
	type SelectSprint
} from '../../db/schema';

export type IssueOverviewType = {
	issue: SelectIssue;
	projects: ProjectsWithUsers[];
	sprints: SprintsWithUsers[];
};
export const IssueOverview = ({
	issue,
	projects,
	sprints
}: IssueOverviewType) => {
	const form = useForm<InsertIssue>();
	const [issueObject, setIssueObject] = useState<SelectIssue>(issue);
	const [sprintsToSelect, setSprintsToSelect] =
		useState<SelectSprint[]>(sprints);

	if (!issue) {
		return <div>Error</div>;
	}
	if (!issue) {
		return <div>Error</div>;
	}

	console.log(issue);
	console.log(`projects in overwiew: ${projects}`);
	console.log(sprints);
	console.log(issue);
	console.log(`projects in overwiew: ${projects}`);
	console.log(sprints);

	const onSubmit = () => {
		console.log(issueObject);
		updateIssue(issueObject);
	};

	return (
		<FormProvider {...form}>
			<form>
				<div className="flex flex-col items-center justify-center">
					<div className="mt-2 flex w-8/12 flex-col gap-4">
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
								setIssueObject({ ...issueObject, ProjectID: selectedProject });
								setSprintsToSelect(
									sprints.filter(s => s.Project.ID === selectedProject)
								);
							}}
							value={issueObject.ProjectID}
						/>
						<div className="grid grid-cols-2">
							<label>Description</label>
							<EditableText
								value={issueObject.Summary}
								{...form}
								name="Summary"
								className="flex w-full flex-grow overflow-hidden rounded-md border-2 border-black p-2"
								placeholder="Enter description..."
								onTextChange={text => {
									setIssueObject({ ...issueObject, Summary: text });
								}}
							/>
						</div>
						<div className="grid grid-cols-2 ">
							<label>Estimation</label>
							<EditableText
								value={
									issueObject.Estimation
										? issueObject.Estimation
										: 'Enter estimation...'
								}
								{...form}
								name="Estimation"
								className="row-span-5 flex w-full flex-grow rounded-md border-2 border-black p-2 p-2"
								placeholder="Enter estimation..."
								onTextChange={text => {
									setIssueObject({ ...issueObject, Estimation: text });
								}}
								type="number"
							/>
						</div>

						<LabelSelectField
							label="Sprint"
							name="sprint"
							data={sprintsToSelect.map(s => ({
								key: s.ID,
								value: s.Name
							}))}
							onChange={selectedOption => {
								const selectedSprint = Number(selectedOption.target.value);
								setIssueObject({ ...issueObject, SprintID: selectedSprint });
							}}
							className="min-w-[230px] flex-grow rounded-md p-2"
							value={issueObject.SprintID ? issueObject.SprintID : undefined}
						/>
						<LabelSelectField
							label="Label"
							name="label"
							data={getLabels().map(l => ({ key: l.ID, value: l.Name }))}
							onChange={selectedOption => {
								const selectedLabel = Number(selectedOption.target.value);
								setIssueObject({ ...issueObject, Label: selectedLabel });
							}}
							className="min-w-[230px] flex-grow rounded-md p-2"
							value={issueObject.Label ? issueObject.Label : undefined}
						/>
						<LabelSelectField
							label="Assignee"
							name="assignee"
							data={projects
								.filter(
									p =>
										p.project?.ID == issueObject.ProjectID && p.project.Members
								)
								.map(p => [...p.project.Members])
								.flat()
								.map(u => ({
									key: u.User.id,
									value: u.User.name
								}))}
							onChange={selectedOption => {
								const selectedAssignee = Number(selectedOption.target.value);
								setIssueObject({
									...issueObject,
									AssignedTo: selectedAssignee
								});
							}}
							className="min-w-[230px] flex-grow rounded-md p-2"
							value={
								issueObject.AssignedTo ? issueObject.AssignedTo : undefined
							}
						/>
					</div>
					<div className="mt-10 flex flex-row-reverse gap-10">
						<button
							className="rounded-md bg-blue-500 px-4 py-2 text-white"
							onClick={() => onSubmit()}
						>
							Save changes
						</button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
};
