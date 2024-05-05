'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { SelectProject, SelectSprint, SelectUser, SelectUserProject, sprint } from '../../db/schema';
import Select, { MultiValue, ActionMeta, SingleValue } from "react-select";
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectOption } from './issue-filters';
import { ProjectsWithUsers } from '@/actions/projectActions';
import { getLabels } from '@/lib/utils';

type CreateIssueDialogType = {
    projects: ProjectsWithUsers[],
    trigger: React.ReactNode,
    sprints: SelectSprint[]
}

const formSchema = z
	.object({
        project: z.string().min(1),
		summary: z.string().min(3),
		description: z.string().optional(),
        sprint: z.string().min(1),
        label: z.string().min(1),
        assignee: z.string().min(1),
		storyPoints: z.number().lt(100),
	});

export type CreateIssueSchema = z.infer<typeof formSchema>;

const CreateIssueDialog = ({projects, trigger, sprints}: CreateIssueDialogType) => {
    const [selectedProject, setSelectedProject] = useState<number>();
    const [sprintsToSelect, setSprintsToSelect] = useState<SelectSprint[]>([]);

    const form = useForm<CreateIssueSchema>({
		resolver: zodResolver(formSchema)
	});

    const submit = () => {
        console.log(form.getValues());
    }

    return (
        <FormProvider {...form}>
            <form>
                <div className=''>
                    <Dialog.Root>
                    <Dialog.Trigger asChild>
                        {trigger}
                    </Dialog.Trigger>
                    <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent bg-slate-300">
                        <Dialog.Title className="DialogTitle text-xl mb-5">Create Issue</Dialog.Title>
                        <div className='flex flex-col gap-4 mt-2'>
                            <div className="grid grid-cols-2">
                                <label>Project</label>
                                <select {...form.register('project')} onChange={(selectedOption) => { 
                                    const selectedProject = Number(selectedOption.target.value);
                                    setSelectedProject(selectedProject);
                                    setSprintsToSelect(sprints.filter(s => s.Project === selectedProject))
                                }}>
                                    {projects.map(p => <option key={p.project?.ID} value={p.project?.ID}>{p.project?.Name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 grid-rows-2">
                                <label>Summary</label>
                                <input {...form.register("summary")} className='rounded-md row-span-2'></input>
                            </div>
                            <div className="grid grid-cols-2">
                                <label>Story points</label>
                                <input {...form.register("storyPoints")} className='rounded-md' type='number'></input>
                            </div>
                            <div className="grid grid-cols-2">
                                <label>Sprint</label>
                                <select {...form.register('sprint')}>
                                    {sprintsToSelect.map(s => <option key={s.ID} value={s.ID}>{s.Name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2">
                                <label>Label</label>
                                <select multiple {...form.register('label')}>
                                    {getLabels().map(l => <option key={l.ID} value={l.ID}>{l.Name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2">
                                <label>Assignee</label>
                                <select {...form.register('assignee')}>
                                    {projects.filter(p => p.project?.ID == selectedProject).map(p => p.user ? <option value={p.user?.ID}>{p.user?.Name}</option> : <></>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 grid-rows-5">
                                <label>Description</label>
                                <textarea {...form.register("description")} className='row-span-5 rounded-md' placeholder='Enter description...'></textarea>
                            </div>
                        </div>
                        <div className='flex flex-row-reverse gap-10 m-5'>
                            <Dialog.Close asChild>
                                <button className="flex-end mb-5" onClick={() => submit()}>Save changes</button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <button className="flex-end mb-5" aria-label="Close">
                                    Close
                                </button>
                            </Dialog.Close>
                        </div>
                        </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>
        </form>
        </FormProvider>
	);
};

export default CreateIssueDialog;
