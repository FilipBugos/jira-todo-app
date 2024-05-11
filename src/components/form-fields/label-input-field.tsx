import { type HTMLProps } from "react";

import { FormInput } from "./form-input";

type FormLabelInputProps = HTMLProps<HTMLInputElement> & {
  name: string;
  label: string;
  type: string;
};

export const LabelInputField = ({
  name,
  label,
  type,
  className,
  ...inputProps
}: FormLabelInputProps) => (
  <div className="grid grid-cols-2">
    <label>{label}</label>
    <FormInput
      name={name}
      type={type}
      className="min-w-[180px] flex-grow p-2 rounded-md"
    />
  </div>
);
