import { CreateIssueLink } from "@/components/create-issue-link";
import { CreateProjectLink } from "@/components/create-project-link";
import { getLoggedInUser, logout } from "@/actions/authActions";

import { PageLink } from "./page-link";
import NavButton from "./nav-button";

export default async function TopNavBar() {
  const loggedInUser = await getLoggedInUser();
  const isUserLoggedIn = !!loggedInUser;
  if (!isUserLoggedIn) {
    return (
      <div className="mb-5 flex flex-row gap-2 bg-slate-300">
        <div className="m-3">
          <PageLink
            className="p-2 hover:rounded-md hover:bg-slate-400"
            href="/"
          >
            Overview
          </PageLink>
        </div>
        <div className="m-3">
          <PageLink
            className="p-2 hover:rounded-md hover:bg-slate-400"
            href="login"
          >
            Log In
          </PageLink>
        </div>
        <div className="m-3">
          <PageLink
            className="p-2 hover:rounded-md hover:bg-slate-400"
            href="signup"
          >
            Sign Up
          </PageLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 flex flex-row gap-2 bg-slate-300">
      <div className="m-3">
        <PageLink className="p-2 hover:rounded-md hover:bg-slate-400" href="/">
          Overview
        </PageLink>
      </div>
      <CreateIssueLink />
      <CreateProjectLink />
      <div className="m-3">
        <PageLink
          className="p-2 hover:rounded-md hover:bg-slate-400"
          href="/profile"
        >
          Profile
        </PageLink>
      </div>
      <div className="m-3">
        <NavButton name="Log Out" />
      </div>
    </div>
  );
}
