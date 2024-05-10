import { cn } from '@/lib/cn';
import { type HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from './form-input';

type FormSelectField = HTMLProps<HTMLSelectElement> & {
	name: string;
    data: {
        key: number,
        value: string,
    }[]
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

    return (<label htmlFor={name} className="form-control w-full">
        <div className='flex flex-col'>
                <select {...register(name)} className={cn(className)} {...selectProps}>
                    <option selected></option>
                    {data.map(d => <option key={d.key} value={d.key}>{d.value}</option>)}
                </select>
                {errors[name] && (
                            <span className="text-red-600 text-xs">
                                {errors[name]?.message?.toString()}
                            </span>
                        )}
                        </div>
            </label>
    );
};
