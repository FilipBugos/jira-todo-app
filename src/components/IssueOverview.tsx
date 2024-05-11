"use client";

import { eq } from "drizzle-orm";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import { getIssue, updateIssue } from "@/actions/issueActions";
import { FormInput } from "@/components/form-fields/form-input";
import EditableText from "@/components/form-fields/editable-text";
import { FormSelectField } from "@/components/form-fields/form-select";
import { LabelSelectField } from "@/components/form-fields/label-select-field";
import { type SprintsWithUsers } from "@/actions/sprintActions";
import { type ProjectsWithUsers } from "@/actions/projectActions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LabelInputField } from "@/components/form-fields/label-input-field";
import { getLabels } from "@/lib/utils";

import {
  type InsertIssue,
  issue,
  type SelectIssue,
  type SelectSprint
} from "../../db/schema";

export type IssueOverviewType = {
  issue: SelectIssue;
  projects: ProjectsWithUsers[];
  sprints: SprintsWithUsers[];
};
export const IssueOverview = ({
  issue,
  projects,
  sprints
}: IssueOverviewType) => {
  const form = useForm<InsertIssue>();
  const [issueObject, setIssueObject] = useState<SelectIssue>(issue);
  const [sprintsToSelect, setSprintsToSelect] =
    useState<SelectSprint[]>(sprints);

  if (!issue) {
    return <div>Error</div>;
  }

  console.log(issue);
  console.log(`projects in overwiew: ${projects}`);
  console.log(sprints);

  const onSubmit = () => {
    console.log(issueObject);
    updateIssue(issueObject);
  };

  return (
    <FormProvider {...form}>
      <form>
        <div className="">
          <div className="flex flex-col gap-4 mt-2">
            <LabelSelectField
              label="Project"
              name="project"
              data={projects.map((p) => ({
                key: p.project?.ID,
                value: p.project?.Name,
              }))}
              className="min-w-[230px] flex-grow p-2 rounded-md"
              onChange={(selectedOption) => {
                const selectedProject = Number(selectedOption.target.value);
                setIssueObject({ ...issueObject, ProjectID: selectedProject });
                setSprintsToSelect(
                  sprints.filter((s) => s.Project.ID === selectedProject)
                );
              }}
              value={issueObject.ProjectID}
            />
            <div className="grid grid-cols-2 grid-rows-5">
              <label>Description</label>
              <EditableText
                value={issueObject.Summary}
                {...form}
                name="Summary"
                className="min-w-[180px] flex-grow p-2 rounded-md row-span-5"
                placeholder="Enter description..."
                onTextChange={(text) => {
                  setIssueObject({ ...issueObject, Summary: text });
                }}
              />
            </div>
            <div className="grid grid-cols-2 grid-rows-5">
              <label>Estimation</label>
              <EditableText
                value={
                  issueObject.Estimation
                    ? issueObject.Estimation
                    : "Enter estimation..."
                }
                {...form}
                name="Estimation"
                className="min-w-[180px] flex-grow p-2 rounded-md row-span-5"
                placeholder="Enter estimation..."
                onTextChange={(text) => {
                  setIssueObject({ ...issueObject, Estimation: text });
                }}
                type="number"
              />
            </div>

            <LabelSelectField
              label="Sprint"
              name="sprint"
              data={sprintsToSelect.map((s) => ({
                key: s.ID,
                value: s.Name,
              }))}
              onChange={(selectedOption) => {
                const selectedSprint = Number(selectedOption.target.value);
                setIssueObject({ ...issueObject, SprintID: selectedSprint });
              }}
              className="min-w-[230px] flex-grow p-2 rounded-md"
              value={issueObject.SprintID ? issueObject.SprintID : undefined}
            />
            <LabelSelectField
              label="Label"
              name="label"
              data={getLabels().map((l) => ({ key: l.ID, value: l.Name }))}
              onChange={(selectedOption) => {
                const selectedLabel = Number(selectedOption.target.value);
                setIssueObject({ ...issueObject, Label: selectedLabel });
              }}
              className="min-w-[230px] flex-grow p-2 rounded-md"
              value={issueObject.Label ? issueObject.Label : undefined}
            />
            <LabelSelectField
              label="Assignee"
              name="assignee"
              data={projects
                .filter(
                  (p) =>
                    p.project?.ID == issueObject.ProjectID && p.project.Members
                )
                .map((p) => [...p.project.Members])
                .flat()
                .map((u) => ({
                  key: u.User.ID,
                  value: u.User.Name
                }))}
              onChange={(selectedOption) => {
                const selectedAssignee = Number(selectedOption.target.value);
                setIssueObject({
                  ...issueObject,
                  AssignedTo: selectedAssignee
                });
              }}
              className="min-w-[230px] flex-grow p-2 rounded-md"
              value={
                issueObject.AssignedTo ? issueObject.AssignedTo : undefined
              }
            />
            <div className="grid grid-cols-2 grid-rows-5">
              <label>Description</label>
              <EditableText
                value={
                  issueObject.Estimation
                    ? issueObject.Estimation
                    : "Enter estimation..."
                }
                {...form}
                name="Description"
                className="min-w-[180px] flex-grow p-2 rounded-md row-span-5"
                onTextChange={(text) => {
                  setIssueObject({ ...issueObject, Description: text });
                }}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse gap-10">
            <button className="flex-end" onClick={() => onSubmit()}>
              Save changes
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
