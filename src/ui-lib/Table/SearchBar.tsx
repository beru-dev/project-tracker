"use client"

import React, { useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getUpdatedUrl, getSearchParams } from "../utils";

export const SearchBar = ({ className }: SearchBarProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const searchParams = useMemo(() => getSearchParams(), [window.location.search]);
    const defaultValue = searchParams.search || "";

    return <input
        type="search"
        placeholder="search"
        ref={ref}
        onKeyDown={(e: React.KeyboardEvent) => {
            if(e.key !== "Enter") return;
            e.preventDefault();

            router.push(getUpdatedUrl({ search: ref.current?.value || "" }, searchParams));
        }}
        {...{ defaultValue, className }}
    />
}

type SearchBarProps = {
    className?: string
}