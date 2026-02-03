import { motion } from "framer-motion";
import { Video, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useFetchProjectById } from "../../hooks/Project/projectHooks";
import { useParams, useNavigate } from "react-router-dom";
import { TicketStage } from "../../types/ticket";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateTicketWithSession } from "../../hooks/Ticket/ticketHook";
import { createTicketSchema } from "../../lib/validations/ticketFormValidation";

export default function BookSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useFetchProjectById(id!);

  const { mutate, isPending } = useCreateTicketWithSession();

  const project = data?.data?.project;

  const [form, setForm] = useState({
    sessionName: "",
    discussionLevel: "" as TicketStage,
    date: "",
    startTime: "",
    duration: 30,
    description: "",
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!project) {
    return <div className="p-10 text-center">Project not found</div>;
  }

  const handleSubmit = () => {
    const parsed = createTicketSchema.safeParse({
      projectId: project._id,
      ...form,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        toast.success("Session request sent successfully");
        navigate("/investor/sessions");
      },
      onError: () => {
        toast.error("Failed to request session");
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: PROJECT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <img
                src={project.coverImageUrl}
                alt={project.startupName}
                className="rounded-xl h-40 w-full object-cover"
              />

              <div>
                <h3 className="font-semibold text-lg">{project.startupName}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.shortDescription}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {project.location}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT: SESSION FORM */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Request a Discussion Session
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <Input
                placeholder="Session title"
                value={form.sessionName}
                onChange={(e) =>
                  setForm({ ...form, sessionName: e.target.value })
                }
              />

              <Select
                value={form.discussionLevel}
                onValueChange={(v) =>
                  setForm({ ...form, discussionLevel: v as TicketStage })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discussion level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TicketStage).map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                />

                <Select
                  value={String(form.duration)}
                  onValueChange={(v) =>
                    setForm({ ...form, duration: Number(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[30, 45, 60, 90].map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} mins
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Optional description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isPending}>
                  Request Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
