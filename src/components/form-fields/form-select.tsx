import { type HTMLProps } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/cn";

import { FormInput } from "./form-input";

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
    <label htmlFor={name} className="form-control w-full min-w-[230px]">
      <select {...register(name)} className={cn(className)} {...selectProps}>
        {!selectProps.value && <option selected />}
        {data.map((d) => (
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
        <span className="text-red-600 text-xs">
          {errors[name]?.message?.toString()}
        </span>
      )}
    </label>
  );
};
