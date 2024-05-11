"use client";

import { SelectSprint } from "../../db/schema";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectsWithUsers } from "@/actions/projectActions";
import { getLabels, getStatuses } from "@/lib/utils";
import { createIssue } from "@/actions/issueActions";
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
import { LabelSelectField } from "./form-fields/label-select-field";

type CreateIssueDialogType = {
  projects: ProjectsWithUsers[];
  trigger: React.ReactNode;
  sprints: SelectSprint[];
};

const formSchema = z.object({
  project: z
    .string()
    .min(1, { message: "Project must be selected" })
    .transform(Number)
    .default(""),
  summary: z
    .string()
    .min(3, { message: "Issue has to contain summary." })
    .default(""),
  description: z.string().optional().default(""),
  sprint: z.string().min(1, { message: "Issue has to be assigned to sprint or backlog." }).transform(Number).default(""),
  label: z.string().optional().transform(Number).default(""),
  assignee: z.string().optional().transform(Number).default(""),
  storyPoints: z.string().optional().transform(Number).default(""),
});

export type CreateIssueSchema = z.infer<typeof formSchema>;

const CreateIssueDialog = ({
  projects,
  trigger,
  sprints,
}: CreateIssueDialogType) => {
  const [selectedProject, setSelectedProject] = useState<number>();
  const [sprintsToSelect, setSprintsToSelect] = useState<SelectSprint[]>([]);

  const form = useForm<CreateIssueSchema>({
    resolver: zodResolver(formSchema),
  });

  const reset = () => {
    form.resetField("project");
    form.resetField("summary");
    form.resetField("description");
    form.resetField("sprint");
    form.resetField("label");
    form.resetField("assignee");
    form.resetField("storyPoints");
  };
  async function submit() {
    form
      .handleSubmit(
        async (issue) => {
          const issueEntity = {
            CreatedBy: 1,
            Project: issue.project,
            Description: issue.description ?? null,
            Summary: issue.summary,
            Estimation: issue.storyPoints,
            CreatedTime: new Date(),
            Label: issue.label,
            Status: getStatuses().at(0)?.Name,
            SprintID: issue.sprint,
            ...(issue.assignee && { AssignedTo: issue.assignee }),
          };

          try {
            await createIssue(issueEntity);
            toast.success("Issue was successfully created");
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

  return (
    <FormProvider {...form}>
      <form>
        <div className="">
          <Dialog onOpenChange={reset}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
              className="DialogContent bg-slate-300 w-6/12"
            >
              <DialogTitle className="DialogTitle text-xl mb-5">
                Create Issue
              </DialogTitle>
              <div className="flex flex-col gap-4 mt-2">
                <LabelSelectField
                  label="Project"
                  name="project"
                  data={projects.map((p) => {
                    return { key: p.project?.ID, value: p.project?.Name };
                  })}
                  className="min-w-[230px] flex-grow p-2 rounded-md"
                  onChange={(selectedOption) => {
                    const selectedProject = Number(selectedOption.target.value);
                    setSelectedProject(selectedProject);
                    setSprintsToSelect(
                      sprints.filter((s) => s.Project === selectedProject)
                    );
                  }}
                />
                <LabelInputField label="Summary" name="summary" type="text" />
                <LabelInputField
                  label="Story points"
                  name="storyPoints"
                  type="number"
                />

                <LabelSelectField
                  label="Sprint"
                  name="sprint"
                  data={sprintsToSelect.map((s) => {
                    return { key: s.ID, value: s.Name };
                  })}
                  className="min-w-[230px] flex-grow p-2 rounded-md"
                />
                <LabelSelectField
                  label="Label"
                  name="label"
                  data={getLabels().map((l) => {
                    return { key: l.ID, value: l.Name };
                  })}
                  className="min-w-[230px] flex-grow p-2 rounded-md"
                />
                <LabelSelectField
                  label="Assignee"
                  name="assignee"
                  data={projects
                    .filter((p) => p.project?.ID == selectedProject && p.user)
                    .map((p) => {
                      return { key: p.user?.ID, value: p.user?.Name };
                    })}
                  className="min-w-[230px] flex-grow p-2 rounded-md"
                />
                <div className="grid grid-cols-2 grid-rows-5">
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

export default CreateIssueDialog;
