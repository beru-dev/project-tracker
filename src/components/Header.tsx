import Link from "next/link";
import { Popover } from "../ui-lib";
import AuthButton from "./AuthButton";
import { FaBars } from "react-icons/fa6";
import "../styles/header.scss";

export default () => {
    return <header>
        <h1>Project Tracker</h1>
        <Popover id="mobile-actions" trigger={<FaBars />}>
            <AuthButton />
        </Popover>
        <nav>
            <Link href={`/projects`}>Projects</Link>
            <Link href={`/tickets`}>Tickets</Link>
            <Popover trigger={<button id="create-button">Create</button>}>
                <Link href={`/create/project`}>Project</Link>
                <Link href={`/create/ticket`}>Ticket</Link>
            </Popover>
        </nav>
        <div id="header-actions">
            <AuthButton />
        </div>
    </header>
}