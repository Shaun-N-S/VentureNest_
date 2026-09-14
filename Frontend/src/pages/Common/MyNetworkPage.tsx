import { Search, Loader2 } from "lucide-react";
import { NetworkProfileCard } from "../../components/card/NetworkProfileCard";
import {
  useGetNetworkUsers,
  useSendConnectionReq,
} from "../../hooks/Relationship/relationshipHooks";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { NetworkUser } from "../../types/networkType";
import toast from "react-hot-toast";

export default function MyNetworkPage() {
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: networkUsers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNetworkUsers(limit, debouncedSearch);
  const { mutate: sendConnection } = useSendConnectionReq();

  // Same IntersectionObserver + sentinel pattern used by the personal
  // posts/projects feeds (see UserProfile.tsx) — the page itself scrolls
  // (there's no bounded overflow container here), so the sentinel just
  // needs to sit at the end of the grid and watch the window.
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const users: NetworkUser[] =
    networkUsers?.pages.flatMap((page) => page.data.users) ?? [];

  const handleConnection = (toUserId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      sendConnection(toUserId, {
        onSuccess: (res) => {
          toast.success(res.message || "Request sent");
          resolve(true);
        },
        onError: (err) => {
          toast.error(err.message || "Failed");
          resolve(false);
        },
      });
    });
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6 max-w-2xl">
        Find Your Next Co-Founder, Investor, or Mentor
      </h1>

      <div className="relative w-full max-w-md mb-10">
        <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white p-3 pl-10 rounded-full shadow-sm border outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <p>Searching...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {" "}
        {users.map((user) => (
          <NetworkProfileCard
            key={user.id}
            id={user.id}
            profileImg={user.profileImg}
            name={user.userName}
            role={user.role}
            desc={user.bio}
            connectionStatus={user.connectionStatus}
            sendConnection={handleConnection}
          />
        ))}
      </div>

      <div ref={ref} className="h-10 flex items-center justify-center mt-4">
        {isFetchingNextPage && <Loader2 className="animate-spin" />}
      </div>
    </div>
  );
}
