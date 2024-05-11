import React, { type HTMLProps, useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/cn";

type EditableTextProps = {
  value: string;
  onTextChange: (text: string) => void;
  name: string;
} & HTMLProps<HTMLTextAreaElement>;

const EditableText = ({
  value,
  onTextChange,
  name,
  ...props
}: EditableTextProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    onTextChange(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={value}
          className={cn(
            `${props.className} , "input input-bordered w-full min-h-20 min-w-20"`
          )}
          {...register(name, {
            onChange: handleInputChange,
            onBlur: handleInputBlur,
          })}
          autoFocus
          {...props}
        />
      ) : (
        <span
          onClick={handleTextClick}
          className={cn(
            `${props.className} , "input input-bordered w-full min-h-20 min-w-20"`
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default EditableText;
