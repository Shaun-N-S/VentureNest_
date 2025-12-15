import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedResponse } from "./pagination";
import type { AllPost } from "./postFeed";

export type InfinitePostsCache = InfiniteData<PaginatedResponse<AllPost>>;
