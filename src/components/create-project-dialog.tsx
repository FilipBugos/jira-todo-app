"use client";

import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createProjectFromDialog,
  type ProjectWithUserProjecs,
} from "@/actions/projectActions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import revalidateRootLayout from "@/common/revalidate";

import { type SelectUser } from "../../db/schema";

import {
  AddParticipantToProject,
  type ParticipantsType
} from "./add-participant-to-project-form";
import { FormInput } from "./form-fields/form-input";
import { LabelInputField } from "./form-fields/label-input-field";

type CreateProjectDialogType = {
  users: SelectUser[];
  trigger: React.ReactNode;
};

const formSchema = z.object({
  name: z.string().min(4, { message: "Project has to have name." }).default(""),
  description: z.string().optional().default("")
});

export type CreateProjectSchema = z.infer<typeof formSchema>;

const CreateProjectDialog = ({ users, trigger }: CreateProjectDialogType) => {
  // TODO: change this once auth is done
  const loggedInUser = 1;
  const [participants, setParticipants] = useState<ParticipantsType[]>([]);
  const [userEntities, setUsers] = useState<SelectUser[]>(users);
  const router = useRouter();

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(formSchema)
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
              Description: userProject.description
            },
            UserProjectEntities: [
              ...participants.map((p) => ({
                User: p.user.id,
                Role: p.role,
              })),
              { User: loggedInUser, Role: "owner" }
            ],
          };

          try {
            await createProjectFromDialog(entity);
            toast.success("Project was successfully created");
            revalidateRootLayout();
            reset();
            document.getElementById("closeDialogBtn")?.click();
          } catch (e) {
            console.log(e);
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
    setUsers(userEntities.filter((u) => u.id !== user.user.id));
  };

  const deleteUser = (user: number) => {
    setParticipants([...participants.filter((u) => u.user.id !== user)]);
    const userEntity = users.find((u) => u.id === user);
    userEntity ? setUsers([...userEntities, userEntity]) : undefined;
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={() => console.log("here2")}>
        <div className="">
          <Dialog onOpenChange={reset}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
              className="DialogContent bg-slate-300 w-5/12"
            >
              <DialogTitle className="DialogTitle text-xl mb-5">
                Create Project
              </DialogTitle>
              <div className="flex flex-col gap-4 mt-2">
                <LabelInputField label="Name" name="name" type="text" />

                <label className="mt-5">Choose project participants</label>

                {participants.map((p) => (
                  <div key={p.user.id} className="flex flex-row gap-10">
                    <FormInput
                      key={p.user.id}
                      disabled
                      name="ParticipantID"
                      value={p.user.name}
                      className="grid-col-0 min-w-[160px] min-h-[40px] p-2 rounded-md"
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
                ))}

                <AddParticipantToProject
                  data={userEntities.map((u) => ({ key: u.id, value: u.name }))}
                  setData={selectUser}
                />

                <div className="grid grid-cols-2 grid-rows-5 mt-5">
                  <label>Description</label>
                  <textarea
                    {...form.register("description")}
                    className="min-w-[180px] flex-grow p-2 rounded-md row-span-5"
                    placeholder="Enter description..."
                  />
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
