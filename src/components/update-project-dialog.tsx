'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

import {
	type getProjectByIDType,
	updateProjectFromDialog
} from '@/actions/projectActions';
import { revalidateProjectLayout } from '@/common/revalidate';
import { ProjectForm } from '@/components/project-form';

import { type SelectProject, type SelectUser } from '../../db/schema';

import { type ParticipantsType } from './add-participant-to-project-form';

type UpdateProjectDialogType = {
	users: SelectUser[];
	trigger: React.ReactNode;
	loggedInUser: SelectUser;
	project: getProjectByIDType;
};

const formSchema = z.object({
	name: z.string().min(4, { message: 'Project has to have name.' }).default(''),
	description: z.string().optional().default('')
});

export type UpdateProjectSchema = z.infer<typeof formSchema>;

const UpdateProjectDialog = ({
	users,
	trigger,
	loggedInUser,
	project
}: UpdateProjectDialogType) => {
	const alreadyExistingParticipants: SelectUser[] = project.Members.map(
		p => p.User
	);

	const [oldParticipants, setOldParticipants] = useState<SelectUser[]>(
		alreadyExistingParticipants
	);
	const [newParticipants, setNewParticipants] = useState<SelectUser[]>(
		alreadyExistingParticipants
	);
	const [userEntities, setUsers] = useState<SelectUser[]>(users);
	const [projectEntity, setProjectEntity] = useState<SelectProject>(project);

	const form = useForm<UpdateProjectSchema>({
		resolver: zodResolver(formSchema),
		values: {
			name: projectEntity.Name,
			description: projectEntity.Description
		}
	});

	// console.log('participants', oldParticipants);

	const reset = () => {
		form.resetField('name');
		form.resetField('description');
		setOldParticipants(alreadyExistingParticipants);
		setUsers(users);
	};

	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	async function submit() {
		const { name, description } = form.getValues();

		const newProject = await updateProjectFromDialog(
			{ ...projectEntity, Name: name, Description: description },
			oldParticipants,
			newParticipants
		);
		if (newProject) {
			toast.success('Project created');
			setProjectEntity({
				...projectEntity,
				Name: name,
				Description: description
			});
			setOldParticipants(newParticipants);
			await revalidateProjectLayout();
		}
	}

	const selectUser = (user: ParticipantsType) => {
		const returnedUser = userEntities.find(u => u.id === user.user.id);
		if (!returnedUser) return;
		setNewParticipants([...oldParticipants, returnedUser]);
		setUsers(userEntities.filter(u => u.id !== returnedUser.id));
	};

	const deleteUser = (user: string) => {
		setNewParticipants([...oldParticipants.filter(u => u.id !== user)]);
		const userEntity = users.find(u => u.id === user);
		userEntity ? setUsers([...userEntities, userEntity]) : undefined;
	};

	console.log('projectName', projectEntity.Name);

	return (
		<FormProvider {...form}>
			<ProjectForm
				label="Update project"
				loggedInUser={loggedInUser}
				reset={reset}
				trigger={trigger}
				submit={submit}
				participants={newParticipants
					.filter(p => p.id !== projectEntity.CreatedBy.id)
					.map(p => ({
						user: { id: p.id, name: p.name }
					}))}
				userEntities={userEntities}
				selectUser={selectUser}
				deleteUser={deleteUser}
				name={projectEntity.Name}
				description={projectEntity.Description}
			/>
		</FormProvider>
	);
};

export default UpdateProjectDialog;
