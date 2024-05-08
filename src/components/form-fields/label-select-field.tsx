import { cn } from '@/lib/cn';
import { type HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from './form-input';
import { FormSelectField } from './form-select';

type FormSelectFieldType = HTMLProps<HTMLSelectElement> & {
	name: string;
    label: string;
    data: {
        key: number,
        value: string,
    }[]
};

export const LabelSelectField = ({
    name,
    data,
    label,
    className,
	...selectProps
}: FormSelectFieldType) => {
    const {
		register,
		formState: { errors }
	} = useFormContext();

    return (
        <div className="grid grid-cols-2">
        <label>{label}</label>
            <FormSelectField name={name} data={data} className={cn(className, "min-w-[230px] flex-grow p-2 rounded-md")} {...selectProps}/>
        </div>
    );
};
