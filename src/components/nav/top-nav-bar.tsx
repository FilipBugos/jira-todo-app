import Link from "next/link";
import { PageLink } from "./page-link";

// TODO: to be completed
export function getNavBarItems() {
    return [
      { Name: "Name", Url: "Open" },
      { Name: "Name", Url: "Open" },
      { Name: "Name", Url: "Open" },
      { Name: "Name", Url: "Open" },
      { Name: "Name", Url: "Open" },
      { Name: "Name", Url: "Open" },
      { Name: "Name", Url: "Open" }
    ];
  }

export default async function TopNavBar() {
  return (
    
    <>
      <div className="bg-slate-300 flex flex-row gap-2" >
        {getNavBarItems().map(i => {
            return( 
            <div className="m-3">
                <Link className="hover:bg-slate-400 hover:rounded-md p-2" href={i.Url}>{i.Name}</Link>
            </div>
            );
        })}
      </div>
    </>
  );
}
