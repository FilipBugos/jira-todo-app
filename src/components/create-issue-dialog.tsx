'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { SelectProject, SelectSprint, SelectUser, SelectUserProject, sprint } from '../../db/schema';
import Select, { MultiValue, ActionMeta, SingleValue } from "react-select";
import { useState } from 'react';
import { SelectOption } from './issue-filters';
import { ProjectsWithUsers } from '@/actions/projectActions';
import { getLabels } from '@/lib/utils';
import { getSprint } from '@/actions/sprintActions';
import { eq } from 'drizzle-orm';

type CreateIssueDialogType = {
    projects: ProjectsWithUsers[],
    trigger: React.ReactNode,
    sprints: SelectSprint[]
}

const CreateIssueDialog = ({projects, trigger, sprints}: CreateIssueDialogType) => {
    const [selectedProject, setSelectedProject] = useState<SelectOption>();
    const [sprintsToSelect, setSprintsToSelect] = useState<SelectSprint[]>([]);

    return (
        <div className='flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95'>
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
                        <Select options={projects.map(p =>  ({value: p.project?.ID, label: p.project?.Name}))}
                        onChange={async (selectedOption) => { 
                            setSelectedProject(selectedOption);
                            setSprintsToSelect(sprints.filter(s => s.Project === selectedOption?.value))
                        }} />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2">
                        <label>Summary</label>
                        <input className='rounded-md row-span-2'></input>
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Story points</label>
                        <input className='rounded-md' type='number'></input>
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Sprint</label>
                        <Select options={sprintsToSelect.map(s => ({value: s.ID, label: s.Name}))}/>
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Label</label>
                        <Select options={getLabels().map(l => ({value: l.ID, label: l.Name}))} />
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Assignee</label>
                        <Select options={projects.filter(p => p.project?.ID == selectedProject?.value).map(p =>  ({value: p.user?.ID, label: p.user?.Name}))} />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-5">
                        <label>Description</label>
                        <textarea className='row-span-5 rounded-md' placeholder='Enter description...'></textarea>
                    </div>
                </div>
                <div className='flex flex-row-reverse gap-10 m-5'>
                    <Dialog.Close asChild>
                        <button className="flex-end mb-5">Save changes</button>
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
	);
};

export default CreateIssueDialog;
