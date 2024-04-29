import React, { ReactNode } from "react";
import { Pagination } from "./Pagination";
import { SearchBar } from "./SearchBar";
import "./searchable-results.scss";

export const SearchableResults = ({
    title,
    actions,
    pageCount, pagePad = 2,
    children
}: SearchableResultsProps) => {
    return <section className="searchable-results">
        { title && <h2>{title}</h2> }

        <SearchBar className="search-bar" />

        { actions && <div className="search-actions">{actions}</div> }

        <div className="results">
            {children}
        </div>

        <Pagination {...{ pageCount, pagePad }} />
    </section>
}

type SearchableResultsProps = {
    title?: string

    actions?: ReactNode

    pageCount: number
    pagePad?: 1 | 2 | 3

    children: ReactNode
}