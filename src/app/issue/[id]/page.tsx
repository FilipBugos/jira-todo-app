// show page where is form with editable text component fields
import React from "react";
import { eq } from "drizzle-orm";

import { getIssue } from "@/actions/issueActions";
import { IssueOverview } from "@/components/IssueOverview";
import { getAllUserProjects } from "@/actions/projectActions";
import { getSprintsOfUser } from "@/actions/sprintActions";

import { issue } from "../../../../db/schema";

type IssueOverviewPageProps = {
  params: {
    id: number;
  };
};

const IssueOverviewPage = async ({ params }: IssueOverviewPageProps) => {
  const retIssue = (await getIssue([eq(issue.ID, params.id)]))[0];
  const loggedInUserId = 1;
  const projects = await getAllUserProjects(loggedInUserId);
  const sprints = await getSprintsOfUser();

  const util = require("util");
  console.log(`SPRINTS: ${sprints} ${sprints[1]}`);
  console.log(util.inspect(sprints, false, null, true /* enable colors */));
  console.log(`PROJECTS: ${projects[0]} ${projects[1]}`);
  console.log(util.inspect(projects, false, null, true /* enable colors */));
  return (
    <IssueOverview
      sprints={sprints.map((s) => s)}
      projects={projects}
      issue={retIssue}
    />
  );
};

export default IssueOverviewPage;
