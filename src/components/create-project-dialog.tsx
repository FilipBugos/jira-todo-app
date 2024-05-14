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
import revalidateRootLayout from '@/common/revalidate';

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
	const [userEntities, setUsers] = useState<SelectUser[]>(users);

	const form = useForm<CreateProjectSchema>({
		resolver: zodResolver(formSchema)
	});

	const reset = () => {
		form.resetField('name');
		form.resetField('description');
		setParticipants([]);
		setUsers(users);
	};

	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	async function submit() {
		form
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
								User: p.user.id,
								Role: p.role
							})),
							{ User: loggedInUser.id, Role: 'owner' }
						]
					};

					try {
						await createProjectFromDialog(entity);
						toast.success('Project was successfully created');
						revalidateRootLayout();
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
			<form onSubmit={() => console.log('here2')}>
				<div className="">
					<Dialog onOpenChange={reset}>
						<DialogTrigger asChild>{trigger}</DialogTrigger>
						<DialogContent
							onInteractOutside={e => {
								e.preventDefault();
							}}
							className="DialogContent w-5/12 bg-slate-300"
						>
							<DialogTitle className="DialogTitle mb-5 text-xl">
								Create Project
							</DialogTitle>
							<div className="mt-2 flex flex-col gap-4">
								<LabelInputField label="Name" name="name" type="text" />

								<label className="mt-5">Choose project participants</label>

								{participants.map(p => (
									<div key={p.user.id} className="flex flex-row gap-10">
										<FormInput
											key={p.user.id}
											disabled
											name="ParticipantID"
											value={p.user.name}
											className="grid-col-0 min-h-[40px] min-w-[160px] rounded-md p-2"
										/>
										<FormInput
											key={p.user.id}
											disabled
											name="ParticipantID"
											value={p.role}
											className="min-h-[40px] min-w-[160px] flex-grow rounded-md p-2"
										/>
										<button
											onClick={() => {
												deleteUser(p.user.id);
											}}
											className="max-w-[30px]"
										>
											<X />
										</button>
									</div>
								))}

								<AddParticipantToProject
									data={userEntities.map(u => ({ key: u.id, value: u.name }))}
									setData={selectUser}
								/>

								<div className="mt-5 grid grid-cols-2 grid-rows-5">
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

export default CreateProjectDialog;
