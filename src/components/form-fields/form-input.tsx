import { cn } from '@/lib/cn';
import { type HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = HTMLProps<HTMLInputElement> & {
	name: string;
};

/**
 * It is recommended to create this reusable input component
 * and use it in each forms.
 */
export const FormInput = ({
    name,
    className,
	...inputProps
}: FormInputProps) => {
    const {
		register,
		formState: { errors }
	} = useFormContext();
    
    return (<label htmlFor={name} className="form-control w-full">
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
				<span className="text-red-600 text-xs">
					{errors[name]?.message?.toString()}
				</span>
			)}
		</label>);
};
