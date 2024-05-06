'use client';

import { issue, SelectSprint } from '../../db/schema';
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
import { isNull } from 'drizzle-orm';

type CreateIssueDialogType = {
    projects: ProjectsWithUsers[],
    trigger: React.ReactNode,
    sprints: SelectSprint[]
}

const formSchema = z
	.object({
        project: z.string().min(1, { message: "Project must be selected" }).transform(Number),
		summary: z.string().min(3, { message: "Issue has to have summary" }),
		description: z.string().optional(),
        sprint: z.string().optional().transform(Number),
        label: z.string().optional().transform(Number),
        assignee: z.string().optional().transform(Number),
		storyPoints: z.string().optional().transform(Number),
	});

export type CreateIssueSchema = z.infer<typeof formSchema>;

const CreateIssueDialog = ({projects, trigger, sprints}: CreateIssueDialogType) => {
    const [selectedProject, setSelectedProject] = useState<number>();
    const [sprintsToSelect, setSprintsToSelect] = useState<SelectSprint[]>([]);

    const form = useForm<CreateIssueSchema>({
		resolver: zodResolver(formSchema)
	});

    async function submit() {
        form.handleSubmit(async issue => {
                console.log("success");            
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
                await createIssue(issueEntity);
            }, error => console.log(error)).call();
    }

    return (
        <FormProvider {...form}>
            <form>
                <div className=''>
                    <Dialog>
                        <DialogTrigger asChild>
                            {trigger}
                        </DialogTrigger>
                        <DialogContent className="DialogContent bg-slate-300">
                            <DialogTitle className="DialogTitle text-xl mb-5">Create Issue</DialogTitle>
                            <div className='flex flex-col gap-4 mt-2'>
                                <div className="grid grid-cols-2">
                                    <label>Project</label>
                                    <select {...form.register('project')} displayEmpty onChange={(selectedOption) => { 
                                        const selectedProject = Number(selectedOption.target.value);
                                        setSelectedProject(selectedProject);
                                        setSprintsToSelect(sprints.filter(s => s.Project === selectedProject))
                                    }}>
                                        <option hidden selected></option>
                                        {projects.map(p => <option key={p.project?.ID} value={p.project?.ID}>{p.project?.Name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-2">
                                    <label>Summary</label>
                                    <input {...form.register("summary")} className='rounded-md row-span-2'></input>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Story points</label>
                                    <input inputMode='decimal' {...form.register("storyPoints")} className='rounded-md' type='number'></input>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Sprint</label>
                                    <select {...form.register('sprint')}>
                                        <option hidden selected></option>
                                        {sprintsToSelect.map(s => <option key={s.ID} value={s.ID}>{s.Name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Label</label>
                                    <select {...form.register('label')}>
                                        <option hidden selected></option>
                                        {getLabels().map(l => <option key={l.ID} value={l.ID}>{l.Name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2">
                                    <label>Assignee</label>
                                    <select {...form.register('assignee')}>
                                        <option hidden selected></option>
                                        {projects.filter(p => p.project?.ID == selectedProject).map(p => p.user ? <option value={p.user?.ID}>{p.user?.Name}</option> : <></>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-5">
                                    <label>Description</label>
                                    <textarea {...form.register("description")} className='row-span-5 rounded-md' placeholder='Enter description...'></textarea>
                                </div>
                            </div>
                            <div className='flex flex-row-reverse gap-10 m-5'>
                                <DialogClose asChild>
                                    <button className="flex-end mb-5" onClick={() => submit()}>Save changes</button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <button className="flex-end mb-5" aria-label="Close">
                                        Close
                                    </button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
        </form>
        </FormProvider>
	);
};

export default CreateIssueDialog;
