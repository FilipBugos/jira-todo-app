import { X } from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { LabelInputField } from '@/components/form-fields/label-input-field';
import { FormInput } from '@/components/form-fields/form-input';
import {
	AddParticipantToProject,
	type ParticipantsType
} from '@/components/add-participant-to-project-form';
import { type CreateProjectSchema } from '@/components/create-project-dialog';

import { type SelectUser } from '../../db/schema';

type ProjectDialogType = {
	label: string;
	reset: () => void;
	trigger: React.ReactNode;
	submit: () => void;
	participants: ParticipantsType[];
	deleteUser: (id: string) => void;
	userEntities: SelectUser[];
	loggedInUser: any;
	selectUser: (user: any) => void;
	name?: string;
	description?: string;
};

export const ProjectForm = ({
	label,
	reset,
	trigger,
	submit,
	participants,
	deleteUser,
	userEntities,
	loggedInUser,
	selectUser,
	name,
	description
}: ProjectDialogType) => {
	const form = useFormContext();

	return (
		<form>
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
							{label}
						</DialogTitle>
						<div className="mt-2 flex flex-col gap-4">
							<LabelInputField label="Name" name="name" type="text" />

							<p className="mt-5">Choose project participants</p>

							{participants.map(p => (
								<div key={p.user.id} className="flex flex-row gap-10">
									<FormInput
										key={p.user.id}
										disabled
										name="ParticipantID"
										value={p.user.name}
										className="grid-col-0 min-h-[40px] min-w-[160px] rounded-md p-2"
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
								data={userEntities
									.filter(u => participants.every(p => p.user.id !== u.id))
									.map(u => ({ key: u.id, value: u.name }))}
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
	);
};
