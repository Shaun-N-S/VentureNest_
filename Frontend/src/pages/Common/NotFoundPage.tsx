import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="space-y-4 text-center">
        <p className="font-display text-7xl font-bold text-primary sm:text-8xl">
          404
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Page Not Found
        </h2>
        <p className="mx-auto max-w-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    </div>
  );
}
