import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types/video';

type PaginationProps = {
    links: PaginationLink[];
    currentPage: number;
    lastPage: number;
};

export default function Pagination({ links, currentPage, lastPage }: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    function navigate(url: string | null) {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    }

    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <nav className="flex items-center justify-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-white disabled:opacity-30"
                disabled={!prevLink?.url}
                onClick={() => navigate(prevLink?.url)}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageLinks.map((link) => (
                <Button
                    key={link.label}
                    variant={link.active ? 'default' : 'ghost'}
                    size="sm"
                    className={
                        link.active
                            ? 'h-9 min-w-9 bg-blue-600 text-white hover:bg-blue-700'
                            : 'h-9 min-w-9 text-slate-400 hover:text-white'
                    }
                    disabled={!link.url}
                    onClick={() => navigate(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}

            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-white disabled:opacity-30"
                disabled={!nextLink?.url}
                onClick={() => navigate(nextLink?.url)}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </nav>
    );
}
