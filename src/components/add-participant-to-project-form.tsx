import { type HTMLProps } from 'react';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

import { FormSelectField } from './form-fields/form-select';

export type ParticipantsType = {
	user: {
		id: string;
		name: string;
	};
};

type AddParticipantFormType = HTMLProps<HTMLSelectElement> & {
	data: {
		key: string;
		value: string;
	}[];
	// eslint-disable-next-line @typescript-eslint/ban-types
	setData: Function;
};

const formSchema = z.object({
	user: z.string().min(1, { message: 'User must be selected' }).default('')
});

export type DataSchema = z.infer<typeof formSchema>;

export const AddParticipantToProject = ({
	data,
	setData
}: AddParticipantFormType) => {
	const form = useForm<DataSchema>({
		resolver: zodResolver(formSchema)
	});

	const reset = () => {
		form.resetField('user');
	};

	const addParticipant = () => {
		form
			.handleSubmit(
				async participant => {
					const userToAdd: ParticipantsType = {
						user: {
							id: participant.user,
							name: data.find(d => d.key === participant.user)?.value ?? ''
						}
					};

					setData(userToAdd);
					reset();
				},
				() => {
					toast.error('Validation error, correct non-valid fields.');
				}
			)
			.call();
	};

	// @ts-ignore
	return (
		<FormProvider {...form}>
			<div className="flex flex-row gap-10">
				<FormSelectField
					data={data}
					name="user"
					className="min-h-[40px] min-w-[160px] flex-grow rounded-md p-2"
				/>
				<button onClick={() => addParticipant()} className="max-w-[30px]">
					<Check />
				</button>
			</div>
		</FormProvider>
	);
};
