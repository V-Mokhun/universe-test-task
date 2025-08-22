import React from "react";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/shared/components/ui/pagination";
import { cn } from "@/shared/lib/utils";
import { useSearchParams } from "react-router-dom";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  disableNext?: boolean;
  disablePrevious?: boolean;
  searchParamKey?: string;
  onPageChange?: (page: number) => void;
};

export const ProjectsPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  disableNext,
  disablePrevious,
  searchParamKey = "page",
  onPageChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    if (onPageChange) return "#";

    const params = new URLSearchParams(searchParams);
    if (pageNumber === 1) {
      params.delete(searchParamKey);
    } else {
      params.set(searchParamKey, pageNumber.toString());
    }
    return `?${params.toString()}`;
  };

  const goTo = (pageNumber: number) => {
    if (onPageChange) {
      onPageChange(pageNumber);
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (pageNumber === 1) {
      params.delete(searchParamKey);
    } else {
      params.set(searchParamKey, pageNumber.toString());
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn({
              "mr-3": true,
              "pointer-events-none opacity-50": disablePrevious,
            })}
            href={createPageUrl(currentPage - 1)}
            onClick={(e) => {
              e.preventDefault();
              if (!disablePrevious) goTo(currentPage - 1);
            }}
          />
        </PaginationItem>

        {currentPage > 2 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink
              href={createPageUrl(1)}
              onClick={(e) => {
                e.preventDefault();
                goTo(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage > 3 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              href={createPageUrl(currentPage - 1)}
              onClick={(e) => {
                e.preventDefault();
                goTo(currentPage - 1);
              }}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            onClick={(e) => {
              e.preventDefault();
              goTo(currentPage);
            }}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={createPageUrl(currentPage + 1)}
              onClick={(e) => {
                e.preventDefault();
                goTo(currentPage + 1);
              }}
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage < totalPages - 2 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < totalPages - 1 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink
              href={createPageUrl(totalPages)}
              onClick={(e) => {
                e.preventDefault();
                goTo(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={cn({
              "ml-3": true,
              "pointer-events-none opacity-50": disableNext,
            })}
            href={createPageUrl(currentPage + 1)}
            onClick={(e) => {
              e.preventDefault();
              if (!disableNext) goTo(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};


