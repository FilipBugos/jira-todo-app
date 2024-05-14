import { type HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
	name: string;
};

export const FormInput = ({
	name,
	className,
	...inputProps
}: FormInputProps) => {
	const {
		register,
		formState: { errors }
	} = useFormContext();

	console.log('FormInput Name', name);
	console.log(register);

	return (
		<div className="form-control w-full">
			<div className="flex flex-col">
				<input
					id={name}
					className={cn(
						'input input-bordered w-full',
						errors[name] && 'input-error',
						className
					)}
					{...inputProps}
					{...register(name)}
				/>

				{errors[name] && (
					<span className="text-xs text-red-600">
						{errors[name]?.message?.toString()}
					</span>
				)}
			</div>
		</div>
	);
};
