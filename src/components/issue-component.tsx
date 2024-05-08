"use client";
import React, { memo, useRef } from "react";
import { SelectIssue } from "../../db/schema";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { IssueJoined } from "@/actions/issueActions";
import { convertLabelIdToLabelName } from "@/lib/utils";

interface IssueProps {
  issue: IssueJoined;
  tableName: string;
  hiddenColumns?: HiddenColumnsType[];
}

type DragAndDropItem = {
  id: number;
  fromTableName: string;
};

type DragAndDropItemCollectType = {
  isDragging: boolean;
};

/**
 * @description
 * Issue component that displays the issue in a table. Table name is needed to know where the issue is coming from.
 *
 * @param issue - issue to be displayed
 * @param tableName - name of table this issue is in.
 * @returns
 */

const hiddenColums = [
  "ID",
  "Description",
  "Summary",
  "Status",
  "CreatedTime",
  "CreatedBy",
  "AssignedTo",
  "Estimation",
  "Label",
  "Sprint",
] as const;

type HiddenColumnsType = (typeof hiddenColums)[number];

const IssueComponent: React.FC<IssueProps> = ({
  issue,
  tableName,
  hiddenColumns = [],
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    DragAndDropItem,
    unknown,
    DragAndDropItemCollectType
  >({
    type: "issue",
    item: {
      id: issue.ID,
      fromTableName: tableName,
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(ref);
  return (
    <div
      className={`flex flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4 ${
        isDragging ? "bg-gray-200" : ""
      }`}
      ref={ref}
    >
      {hiddenColumns.includes("ID") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 5%" }}
        >
          {issue.ID}
        </div>
      )}
      {hiddenColumns.includes("Description") ? null : (
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{ flex: "1 1 auto" }}
        >
          {issue.Description}
        </div>
      )}
      {hiddenColumns.includes("Summary") ? null : (
        <div
          className="flex items-center justify-center overflow-hidden whitespace-nowrap"
          style={{ flex: "0 1 15%" }}
        >
          {issue.Summary}
        </div>
      )}
      {hiddenColumns.includes("Status") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(
              issue.Status
            )}`}
          >
            {issue.Status}
          </span>
        </div>
      )}
      {hiddenColumns.includes("CreatedTime") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          Created at: {issue.CreatedTime?.toLocaleDateString()}
        </div>
      )}
      {hiddenColumns.includes("CreatedBy") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          Author: {issue.CreatedBy?.Name}
        </div>
      )}
      {hiddenColumns.includes("AssignedTo") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          Assignee: {issue.AssignedTo?.Name}
        </div>
      )}
      {hiddenColumns.includes("Estimation") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          Estimate: {issue.Estimation ? `${issue.Estimation}h` : ""}
        </div>
      )}
      {hiddenColumns.includes("Label") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          {convertLabelIdToLabelName(issue.Label)}
        </div>
      )}
      {hiddenColumns.includes("Sprint") ? null : (
        <div
          className="flex items-center justify-center"
          style={{ flex: "0 0 10%" }}
        >
          Sprint: {issue.Sprint?.Name ?? "None"}
        </div>
      )}
    </div>
  );
};

// TODO: statuses
function statusColor(status: string | null) {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-800";
    case "In progress":
      return "bg-yellow-100 text-yellow-800";
    case "Done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default memo(IssueComponent);
export { type HiddenColumnsType };
