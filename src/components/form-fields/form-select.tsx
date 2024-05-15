import { type HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/cn';

type FormSelectField = HTMLProps<HTMLSelectElement> & {
	name: string;
	data: {
		key: number;
		value: string;
	}[];
};

export const FormSelectField = ({
	name,
	data,
	className,
	...selectProps
}: FormSelectField) => {
	const {
		register,
		formState: { errors }
	} = useFormContext();
	console.log(data);
	return (
		<label
			htmlFor={name}
			className="form-control flex w-full min-w-[230px] flex-col"
		>
			<select {...register(name)} className={cn(className)} {...selectProps}>
				{!selectProps.value && <option selected />}
				{data.map(d => (
					<option
						selected={d.key === selectProps?.value}
						key={d.key}
						value={d.key}
					>
						{d.value}
					</option>
				))}
			</select>
			{errors[name] && (
				<span className="text-xs text-red-600">
					{errors[name]?.message?.toString()}
				</span>
			)}
		</label>
	);
};
