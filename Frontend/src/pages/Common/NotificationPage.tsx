import { Inbox } from "lucide-react";
import { ConnectionRequestCard } from "../../components/card/ConnectionRequestCard ";
import { useConnectionStatusUpdate, useGetConnectionReq } from "../../hooks/Relationship/relationshipHooks";
import toast from "react-hot-toast";
import type { NetworkUser } from "../../types/networkType";
import { useState } from "react";
import { AxiosError } from "axios";
import { queryClient } from "../../main";

export default function NotificationPage() {
    const [page] = useState(1);
    const [limit] = useState(10);
    const { data, isLoading } = useGetConnectionReq(page, limit);
    const { mutate: updateConnectionReqStatus } = useConnectionStatusUpdate();
    console.log(data, isLoading);

    const requests: NetworkUser[] = data?.data?.users || [];

    const handleAccept = (userId: string) => {
        updateConnectionReqStatus(
            { fromUserId: userId, status: "accepted" },
            {
                onSuccess: (res) => {
                    queryClient.invalidateQueries({
                        queryKey: ["personal-connection-req", page, limit]
                    })
                    toast.success("Connection accepted");
                },
                onError: (err) => {
                    if (err instanceof AxiosError)
                        toast.error(err?.response?.data?.message || "Something went wrong");
                },
            }
        );
    };

    const handleReject = (userId: string) => {
        updateConnectionReqStatus(
            { fromUserId: userId, status: "rejected" },
            {
                onSuccess: (res) => {
                    toast.success(res?.message || "Connection rejected");
                },
                onError: (err) => {
                    if (err instanceof AxiosError)
                        toast.error(err?.response?.data?.message || "Error rejecting request");
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center py-10 px-4">
            {/* Loading State */}
            {isLoading && <p className="text-gray-600 mt-6">Fetching requests...</p>}

            {/* Requests List */}
            <div className="grid gap-5 w-full max-w-lg mt-8">
                {requests.length > 0 ? (
                    requests.map((user) => (
                        <ConnectionRequestCard
                            key={user.id}
                            user={user}
                            onAccept={handleAccept}
                            onReject={handleReject}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center gap-3 p-10 text-gray-500">
                        <Inbox className="w-12 h-12 opacity-70" />
                        <p className="text-lg font-semibold">No new requests</p>
                        <span className="text-sm text-gray-400">You’ll see new connection alerts here.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
