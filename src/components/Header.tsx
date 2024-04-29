import Link from "next/link";
import { Popover } from "ui-lib";
import AuthButton from "./AuthButton";
import "../styles/header.scss";

export default () => {
    return <header>
        <h1>Project Tracker</h1>
        <nav>
            <Link href={`/projects`}>Projects</Link>
            <Link href={`/tickets`}>Tickets</Link>
        </nav>
        <div id="header-actions">
            <Popover trigger={<button id="create-button">Create</button>}>
                <Link href={`/create/project`}>Project</Link>
                <Link href={`/create/ticket`}>Ticket</Link>
            </Popover>
            <AuthButton />
        </div>
    </header>
}