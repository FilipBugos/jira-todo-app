'use client';
import React, { useEffect, useState } from 'react';
import Select, { type MultiValue } from 'react-select';

export type SelectOption = {
	value: number;
	label: string;
};

type IssueFilterProps = {
	onFilterChange: (filters: FilterValues) => void;
	usersOptions: SelectOption[];
	statusOptions: SelectOption[];
	labelOptions: SelectOption[];
};

export type FilterValues = {
	summaryFilter: string;
	descriptionFilter: string;
	createdByFilter: MultiValue<SelectOption>;
	assignedToFilter: MultiValue<SelectOption>;
	statusFilter: MultiValue<SelectOption>;
	labelFilter: MultiValue<SelectOption>;
};

/**
 *
 * On every input change this component calls onFilterChange with the new filter values
 *
 * @param onFilterChange - callbed for on filter change
 * @param labelOptions - label options
 * @param statusOptions - status options
 * @param usersOptions - user options
 * @returns
 */
const IssueFilter: React.FC<IssueFilterProps> = ({
	onFilterChange,
	labelOptions,
	statusOptions,
	usersOptions
}) => {
	const [summaryFilter, setSummaryFilter] = useState<string>('');
	const [descriptionFilter, setDescriptionFilter] = useState<string>('');
	const [createdByFilter, setCreatedByFilter] = useState<
		MultiValue<SelectOption>
	>([]);
	const [assignedToFilter, setAssignedToFilter] = useState<
		MultiValue<SelectOption>
	>([]);
	const [statusFilter, setStatusFilter] = useState<MultiValue<SelectOption>>(
		[]
	);
	const [labelFilter, setLabelFilter] = useState<MultiValue<SelectOption>>([]);

	useEffect(() => {
		onFilterChange({
			summaryFilter,
			descriptionFilter,
			createdByFilter,
			assignedToFilter,
			statusFilter,
			labelFilter
		});
	}, [
		summaryFilter,
		descriptionFilter,
		createdByFilter,
		assignedToFilter,
		statusFilter,
		labelFilter,
		onFilterChange
	]);

	return (
		<div className="mb-4 flex flex-wrap gap-2">
			<input
				type="text"
				placeholder="Filter by Summary"
				value={summaryFilter}
				onChange={e => setSummaryFilter(e.target.value)}
				className="min-w-[180px] flex-grow rounded-md border border-gray-300 p-2"
			/>
			<input
				type="text"
				placeholder="Filter by Description"
				value={descriptionFilter}
				onChange={e => setDescriptionFilter(e.target.value)}
				className="min-w-[180px] flex-grow rounded-md border border-gray-300 p-2"
			/>
			<Select
				isMulti
				options={usersOptions}
				value={createdByFilter}
				onChange={selectedOptions => setCreatedByFilter(selectedOptions)}
				placeholder="Filter by Created By"
				className="min-w-[180px] flex-grow rounded-md p-2"
			/>
			<Select
				isMulti
				options={usersOptions}
				value={assignedToFilter}
				onChange={selectedOptions => setAssignedToFilter(selectedOptions)}
				placeholder="Filter by Assigned To"
				className="min-w-[180px] flex-grow rounded-md p-2"
			/>
			<Select
				isMulti
				options={statusOptions}
				value={statusFilter}
				onChange={selectedOptions => setStatusFilter(selectedOptions)}
				placeholder="Filter by Status"
				className="min-w-[180px] flex-grow rounded-md p-2"
			/>
			<Select
				isMulti
				options={labelOptions}
				value={labelFilter}
				onChange={selectedOptions => setLabelFilter(selectedOptions)}
				placeholder="Filter by Label"
				className="min-w-[180px] flex-grow rounded-md p-2"
			/>
		</div>
	);
};

export default IssueFilter;
