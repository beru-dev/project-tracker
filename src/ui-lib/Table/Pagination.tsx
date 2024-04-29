"use client"

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAnglesLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6";
import { getUpdatedUrl, getSearchParams } from "../utils";

export const Pagination = ({ pageCount, pagePad }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useMemo(() => getSearchParams(), [window.location.search]);
    const ref = useRef<HTMLInputElement>(null);
    const page = Number(searchParams?.page) || 1;

    const pageRange = (direction: "min" | "pos", pagePad: number) => {
        const start = direction === "min" ? Math.max(page - pagePad, 1) : page + 1;
        const stop = direction === "min" ? page : Math.min(page + pagePad + 1, pageCount + 1);

        const pageNumbers = Array.from(
            { length: stop - start },
            (_, index) => start + index
        );

        return pageNumbers.map((newPage, index) =>
                <Link href={getUpdatedUrl({ page: newPage.toString() }, searchParams)} key={index}></Link>
        );
    }

    const widthClass = {
        1: "one",
        2: "two",
        3: "three"
    }

    return <div className={`pagination ${widthClass[pagePad]}`}>
        {
            page > 1 && <>
                <Link href={getUpdatedUrl({ page: "1" }, searchParams)}><FaAnglesLeft /></Link>
                <Link href={getUpdatedUrl({ page: (page - 1).toString() }, searchParams)}><FaAngleLeft /></Link>
            </>
        }
        { pageRange("min", pagePad) }
        <input
            type="number"
            ref={ref}
            defaultValue={page}
            onKeyDown={(e: React.KeyboardEvent) => {
                if(e.key !== "Enter") return;
                e.preventDefault();

                router.push(getUpdatedUrl({ page: ref.current?.value || "" }, searchParams));
            }}
        />
        {  pageRange("pos", pagePad) }
        {
            page < pageCount && <>
                <Link href={getUpdatedUrl({ page: (page + 1).toString() }, searchParams)}><FaAngleRight /></Link>
                <Link href={getUpdatedUrl({ page: pageCount.toString() }, searchParams)}><FaAnglesRight /></Link>
            </>
        }
    </div>
}

type PaginationProps = {
    pageCount: number
    pagePad: 1 | 2 | 3
}