'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { X } from 'lucide-react';

import {
	createProjectFromDialog,
	type ProjectWithUserProjecs
} from '@/actions/projectActions';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { revalidateRootLayout } from '@/common/revalidate';
import { ProjectForm } from '@/components/project-form';

import { type SelectUser } from '../../db/schema';

import {
	AddParticipantToProject,
	type ParticipantsType
} from './add-participant-to-project-form';
import { FormInput } from './form-fields/form-input';
import { LabelInputField } from './form-fields/label-input-field';

type CreateProjectDialogType = {
	users: SelectUser[];
	trigger: React.ReactNode;
	loggedInUser: SelectUser;
};

const formSchema = z.object({
	name: z.string().min(4, { message: 'Project has to have name.' }).default(''),
	description: z.string().optional().default('')
});

export type CreateProjectSchema = z.infer<typeof formSchema>;

const CreateProjectDialog = ({
	users,
	trigger,
	loggedInUser
}: CreateProjectDialogType) => {
	const [participants, setParticipants] = useState<ParticipantsType[]>([]);
	const [userEntities, setUsers] = useState<SelectUser[]>(
		users.filter(u => u.id !== loggedInUser.id)
	);

	const form = useForm<CreateProjectSchema>({
		resolver: zodResolver(formSchema)
	});

	const reset = () => {
		form.resetField('name');
		form.resetField('description');
		setParticipants([]);
		setUsers(users.filter(u => u.id !== loggedInUser.id));
	};

	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	async function submit() {
		await form
			.handleSubmit(
				async userProject => {
					const entity: ProjectWithUserProjecs = {
						// set current logged in user
						Project: {
							CreatedBy: loggedInUser.id,
							CreatedTime: new Date(),
							Name: userProject.name,
							Description: userProject.description
						},
						UserProjectEntities: [
							...participants.map(p => ({
								User: p.user.id
							})),
							{ User: loggedInUser.id }
						]
					};

					try {
						await createProjectFromDialog(entity);
						toast.success('Project was successfully created');
						await revalidateRootLayout();
						reset();
						document.getElementById('closeDialogBtn')?.click();
					} catch (e) {
						console.log(e);
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

	const selectUser = (user: ParticipantsType) => {
		setParticipants([...participants, user]);
		setUsers(userEntities.filter(u => u.id !== user.user.id));
	};

	const deleteUser = (user: string) => {
		setParticipants([...participants.filter(u => u.user.id !== user)]);
		const userEntity = users.find(u => u.id === user);
		userEntity ? setUsers([...userEntities, userEntity]) : undefined;
	};

	return (
		<FormProvider {...form}>
			<ProjectForm
				label="Create new project"
				loggedInUser={loggedInUser}
				reset={reset}
				trigger={trigger}
				submit={submit}
				participants={participants}
				userEntities={userEntities}
				selectUser={selectUser}
				deleteUser={deleteUser}
			/>
		</FormProvider>
	);
};

export default CreateProjectDialog;
