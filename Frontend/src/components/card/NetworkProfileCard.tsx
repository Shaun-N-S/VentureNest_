import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import type { NetworkProfileCardProps } from "../../types/networkProfileCardProps";
import type { ConnectionStatus } from "../../types/connectionStatus";

export const NetworkProfileCard = ({
    id,
    profileImg,
    name,
    role,
    desc,
    sendConnection,
    connectionStatus,
}: NetworkProfileCardProps) => {

    const [status, setStatus] = useState<ConnectionStatus>(connectionStatus);
    const firstLetter = name.charAt(0).toUpperCase();

    const handleClick = async () => {
        if (status !== "none") return;
        const ok = await sendConnection(id);
        if (ok) setStatus("pending");
    };

    const label =
        status === "none" ? "Connect" :
            status === "pending" ? "Pending" :
                status === "accepted" ? "Connected ✓" : "Pending";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl shadow-md p-4 text-center hover:bg-gray-50">
                <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profileImg || undefined} />
                    <AvatarFallback>{firstLetter}</AvatarFallback>
                </Avatar>

                <CardContent className="mt-3 space-y-1">
                    <h2 className="font-semibold">{name}</h2>
                    <p className="text-sm text-gray-600">{role}</p>
                    <p className="text-sm text-gray-500">{desc}</p>

                    <Button
                        disabled={status !== "none"}
                        onClick={handleClick}
                        className={`w-full rounded-xl ${status === "none"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {label}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};
