import { type HTMLProps } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check } from "lucide-react";

import { FormInput } from "./form-fields/form-input";
import { FormSelectField } from "./form-fields/form-select";

export type ParticipantsType = {
  role: string;
  user: {
    id: number;
    name: string;
  };
};

type AddParticipantFormType = HTMLProps<HTMLSelectElement> & {
  data: {
    key: number;
    value: string;
  }[];
  setData: Function;
};

const formSchema = z.object({
  user: z
    .string()
    .min(1, { message: "User must be selected" })
    .transform(Number)
    .default(""),
  role: z.string().min(3, { message: "Role  must be specified" })
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
    form.resetField("user");
    form.resetField("role");
  };

  const addParticipant = () => {
    form
      .handleSubmit(
        async (participant) => {
          const userToAdd: ParticipantsType = {
            role: participant.role,
            user: {
              id: participant.user,
              name: data.find((d) => d.key === participant.user)?.value ?? ""
            },
          };

          setData(userToAdd);
          reset();
        },
        () => {
          toast.error("Validation error, correct non-valid fields.");
        }
      )
      .call();
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-row gap-10">
        <FormSelectField
          data={data}
          name="user"
          className="min-w-[160px] min-h-[40px] flex-grow p-2 rounded-md"
        />
        <FormInput
          name="role"
          className="min-w-[160px] min-h-[40px] flex-grow p-2 rounded-md"
        />
        <button onClick={() => addParticipant()} className="max-w-[30px]">
          <Check />
        </button>
      </div>
    </FormProvider>
  );
};
