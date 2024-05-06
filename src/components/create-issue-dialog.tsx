'use client';

import { SelectSprint } from '../../db/schema';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectsWithUsers } from '@/actions/projectActions';
import { getLabels, getStatuses } from '@/lib/utils';
import { createIssue } from '@/actions/issueActions';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { FormInput } from './form-fields/form-input';
import { toast } from 'sonner';

type CreateIssueDialogType = {
    projects: ProjectsWithUsers[],
    trigger: React.ReactNode,
    sprints: SelectSprint[]
}

const formSchema = z
	.object({
        project: z.string().min(1, { message: "Project must be selected" }).transform(Number).default(""),
		summary: z.string().min(3, { message: "Issue has to contain summary." }).default(""),
		description: z.string().optional().default(""),
        sprint: z.string().optional().transform(Number).default(""),
        label: z.string().optional().transform(Number).default(""),
        assignee: z.string().optional().transform(Number).default(""),
		storyPoints: z.string().optional().transform(Number).default(""),
	});

export type CreateIssueSchema = z.infer<typeof formSchema>;

const CreateIssueDialog = ({projects, trigger, sprints}: CreateIssueDialogType) => {
    const [selectedProject, setSelectedProject] = useState<number>();
    const [sprintsToSelect, setSprintsToSelect] = useState<SelectSprint[]>([]);

    const form = useForm<CreateIssueSchema>({
		resolver: zodResolver(formSchema)
	});

    const errors = form.formState.errors;

    const reset = () => {
        form.resetField('project');
        form.resetField('summary');
        form.resetField('description');
        form.resetField('sprint');
        form.resetField('label');
        form.resetField('assignee');
        form.resetField('storyPoints');
    }
    async function submit() {
        form.handleSubmit(async issue => {
                const issueEntity = {
                    CreatedBy: 1,
                    Project: issue.project,
                    Description: issue.description ?? null,
                    Summary: issue.summary,
                    Estimation: issue.storyPoints,
                    CreatedTime: new Date(),
                    Label: issue.label,
                    Status: getStatuses().at(0)?.Name,
                    ...(issue.sprint && {SprintID: issue.sprint}),
                    ...(issue.assignee && {AssignedTo: issue.assignee}),   
                }

                try {
                    await createIssue(issueEntity);
                    toast.success('Issue was successfully created');
                    reset();
                    document.getElementById('closeDialogBtn')?.click();
                } catch(e) {
                    if (e instanceof Error) {
                        toast.error(e.message);
                    }
                }
            }, () => {
                toast.error("Validation error, correct non-valid fields.");
            }).call()
    };
        
    // TODO: the dialog is very small
    return (
        <FormProvider {...form}>
            <form>
                <div className=''>
                    <Dialog>
                        <DialogTrigger asChild>
                            {trigger}
                        </DialogTrigger>
                        <DialogContent onInteractOutside={(e) => {
                                        e.preventDefault();
                                        }} 
                                className="DialogContent bg-slate-300 w-full">
                            <DialogTitle className="DialogTitle text-xl mb-5">Create Issue</DialogTitle>
                            <div className='flex flex-col gap-4 mt-2'>
                                <div className="grid grid-cols-2">
                                    <label>Project</label>
                                    <div>
                                        <select {...form.register('project')} onChange={(selectedOption) => { 
                                            const selectedProject = Number(selectedOption.target.value);
                                            setSelectedProject(selectedProject);
                                            setSprintsToSelect(sprints.filter(s => s.Project === selectedProject))
                                        }} className="min-w-[230px] flex-grow p-2 rounded-md">
                                            <option className="min-w-[230px] flex-grow p-2 rounded-md" selected></option>
                                            {projects.map(p => <option key={p.project?.ID} value={p.project?.ID}>{p.project?.Name}</option>)}
                                        </select>
                                        {errors.project && <span className='text-red-600 text-xs'>{errors.project.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Summary</label>
                                    <FormInput {...form.register("summary")} className="min-w-[180px] flex-grow p-2 rounded-md" />
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Story points</label>
                                    <FormInput {...form.register("storyPoints")} type='number' className="min-w-[180px] flex-grow p-2 rounded-md" />
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Sprint</label>
                                    <select {...form.register('sprint')} className="min-w-[180px] flex-grow p-2 rounded-md">
                                        <option selected></option>
                                        {sprintsToSelect.map(s => <option key={s.ID} value={s.ID}>{s.Name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Label</label>
                                    <select {...form.register('label')} className="min-w-[180px] flex-grow p-2 rounded-md">
                                        <option selected></option>
                                        {getLabels().map(l => <option key={l.ID} value={l.ID}>{l.Name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Assignee</label>
                                    <select {...form.register('assignee')} className="min-w-[180px] flex-grow p-2 rounded-md">
                                        <option selected></option>
                                        {projects.filter(p => p.project?.ID == selectedProject).map(p => p.user ? <option value={p.user?.ID}>{p.user?.Name}</option> : <></>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-5">
                                    <label>Description</label>
                                    <textarea {...form.register("description")} className="min-w-[180px] flex-grow p-2 rounded-md row-span-5" placeholder='Enter description...'></textarea>
                                </div>
                            </div>
                            <DialogFooter>
                            <div className='flex flex-row-reverse gap-10'>
                                    <button className="flex-end" onClick={() => submit()}>Save changes</button>
                                <DialogClose asChild>
                                    <button id="closeDialogBtn" onClick={() => {
                                        reset();
                                    }} className="flex-end">
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
