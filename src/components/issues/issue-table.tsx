"use client";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { SelectIssue } from "../../../db/schema";
import IssueComponent, { HiddenColumnsType } from "./issue-component";
import { useRef } from "react";
import { IssueJoined } from "@/actions/issueActions";

interface IssueTableProps {
  issues: IssueJoined[];
  onDropIssue?: (id: number, toTable: string) => void;
  tableName?: string;
  hiddenColumns?: HiddenColumnsType[];
}

/**
 *
 * @param issues - issues to be displayed
 * @param onDropIssue - function to be called when issue is dropped inside of this table
 * @param tableName - name of the table, used for drag&drop
 * @returns
 */
const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  onDropIssue,
  tableName,
  hiddenColumns,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "issue",
    drop: (
      item: { id: number; fromTableName: string },
      monitor: DropTargetMonitor
    ) => {
      if (monitor.didDrop() || !onDropIssue) {
        return;
      }
      onDropIssue(item.id, item.fromTableName);
    },
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className="bg-gray-100 p-4 rounded-lg shadow  border border-gray-300 my-2"
    >
      {issues.length === 0 && (
        <p className="text-center text-gray-500">No issues</p>
      )}
      {issues.map((issue) => (
        <IssueComponent
          key={issue.ID}
          issue={issue}
          tableName={tableName}
          hiddenColumns={hiddenColumns}
        />
      ))}
    </div>
  );
};

export default IssueTable;
