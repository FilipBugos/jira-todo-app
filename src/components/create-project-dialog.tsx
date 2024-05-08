"use client";

import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LabelInputField } from "./form-fields/label-input-field";
import { FormSelectField } from "./form-fields/form-select";
import { FormInput } from "./form-fields/form-input";
import { useState } from "react";
import { SelectUser } from "../../db/schema";
import {
  AddParticipantToProject,
  ParticipantsType,
} from "./add-participant-to-project-form";
import { Description } from "@radix-ui/react-dialog";
import {
  createProjectWithUserProject,
  ProjectWithUserProjecs,
} from "@/actions/projectActions";
import { revalidatePath, revalidateTag } from "next/cache";
import router from "next/router";
import { Check, X } from "lucide-react";

type CreateProjectDialogType = {
  users: SelectUser[];
  trigger: React.ReactNode;
};

const formSchema = z.object({
  name: z.string().min(4, { message: "Project has to have name." }).default(""),
  description: z.string().optional().default(""),
});

export type CreateProjectSchema = z.infer<typeof formSchema>;

const CreateProjectDialog = ({ users, trigger }: CreateProjectDialogType) => {
  const [participants, setParticipants] = useState<ParticipantsType[]>([]);
  const [userEntities, setUsers] = useState<SelectUser[]>(users);

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(formSchema),
  });

  const reset = () => {
    form.resetField("name");
    form.resetField("description");
    setParticipants([]);
    setUsers(users);
  };

  async function submit() {
    form
      .handleSubmit(
        async (userProject) => {
          const entity: ProjectWithUserProjecs = {
            // set current logged in user
            Project: {
              CreatedBy: 1,
              CreatedTime: new Date(),
              Name: userProject.name,
              Description: userProject.description,
            },
            UserProjectEntities: participants.map((p) => {
              return {
                User: p.user.id,
                Role: p.role,
              };
            }),
          };

          try {
            await createProjectWithUserProject(entity);
            //revalidateTag();
            toast.success("Project was successfully created");
            reset();
            document.getElementById("closeDialogBtn")?.click();
          } catch (e) {
            if (e instanceof Error) {
              toast.error(e.message);
            }
          }
        },
        () => {
          toast.error("Validation error, correct non-valid fields.");
        }
      )
      .call();
  }

  const selectUser = (user: ParticipantsType) => {
    setParticipants([...participants, user]);
    setUsers(userEntities.filter((u) => u.ID !== user.user.id));
  };

  const deleteUser = (user: number) => {
    setParticipants([...participants.filter((u) => u.user.id !== user)]);
    const userEntity = users.find((u) => u.ID === user);
    userEntity ? setUsers([...userEntities, userEntity]) : undefined;
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={() => console.log("here2")}>
        <div>
          <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
              className="DialogContent bg-slate-300 w-8/12"
            >
              <DialogTitle className="DialogTitle text-xl mb-5">
                Create Project
              </DialogTitle>
              <div className="flex flex-col gap-4 mt-2">
                <LabelInputField label="Name" name="name" type="text" />

                <label className="mt-5">Choose project participants</label>

                {participants.map((p) => {
                  return (
                    <div key={p.user.id} className="grid grid-cols-3 gap-10">
                      <FormInput
                        key={p.user.id}
                        disabled
                        name="ParticipantID"
                        value={p.user.name}
                        className="min-w-[160px] min-h-[40px] flex-grow p-2 rounded-md"
                      />
                      <FormInput
                        key={p.user.id}
                        disabled
                        name="ParticipantID"
                        value={p.role}
                        className="min-w-[160px] min-h-[40px] flex-grow p-2 rounded-md"
                      />
                      <button
                        onClick={() => {
                          deleteUser(p.user.id);
                        }}
                        className="max-w-[30px]"
                      >
                        <X />
                      </button>
                    </div>
                  );
                })}

                <AddParticipantToProject
                  data={userEntities.map((u) => {
                    return { key: u.ID, value: u.Name };
                  })}
                  setData={selectUser}
                />

                <div className="grid grid-cols-2 grid-rows-5 mt-5">
                  <label>Description</label>
                  <textarea
                    {...form.register("description")}
                    className="min-w-[180px] flex-grow p-2 rounded-md row-span-5"
                    placeholder="Enter description..."
                  ></textarea>
                </div>
              </div>
              <DialogFooter>
                <div className="flex flex-row-reverse gap-10">
                  <button className="flex-end" onClick={() => submit()}>
                    Save changes
                  </button>
                  <DialogClose asChild>
                    <button
                      id="closeDialogBtn"
                      onClick={() => {
                        reset();
                      }}
                      className="flex-end"
                    >
                      Close
                    </button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateProjectDialog;
