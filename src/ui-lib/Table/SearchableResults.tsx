import React, { ReactNode } from "react";
import { Pagination } from "./Pagination";
import { SearchBar } from "./SearchBar";
import "./searchable-results.scss";

export const SearchableResults = ({
    title,
    pageCount,
    pagePad = 2,
    children
}: SearchableResultsProps) => {
    return <section className="searchable-results">
        { title && <h2>{title}</h2> }

        <SearchBar className="search-bar" />

        <div className="results">
            {children}
        </div>

        <Pagination {...{ pageCount, pagePad }} />
    </section>
}

type SearchableResultsProps = {
    title?: string

    pageCount: number
    pagePad?: 1 | 2 | 3

    children: ReactNode
}