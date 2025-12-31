import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { X, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { useDebounce } from "../../hooks/Debounce/useDebounce";

export interface PersonItem {
  id: string;
  name: string;
  subtitle?: string;
  avatar?: string;
  actionLabel?: string;
}

interface PeopleListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;

  people: PersonItem[];
  loading?: boolean;

  hasNextPage?: boolean;
  fetchNextPage?: () => void;

  onActionClick?: (id: string) => void;
}

export function PeopleListModal({
  open,
  onOpenChange,
  title,
  loading = false,
  people,
  hasNextPage,
  fetchNextPage,
  onActionClick,
}: PeopleListModalProps) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const filteredPeople = useMemo(() => {
    if (!debouncedSearch) return people;

    return people.filter((p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [people, debouncedSearch]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      hasNextPage &&
      !loading
    ) {
      fetchNextPage?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <button onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* List */}
        <div
          className="max-h-[400px] overflow-y-auto px-6 py-2 space-y-3"
          onScroll={handleScroll}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      {person.subtitle && (
                        <p className="text-xs text-muted-foreground">
                          {person.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {person.actionLabel && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onActionClick?.(person.id)}
                    >
                      {person.actionLabel}
                    </Button>
                  )}
                </div>
              ))}

          {!loading && filteredPeople.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No results found
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Skeleton ---------------- */

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  );
}
