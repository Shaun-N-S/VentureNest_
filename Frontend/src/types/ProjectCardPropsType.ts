export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stage: string;
  logoUrl?: string;
  likes?: number;
  liked?: boolean;
  onLike?: () => void;

  onEdit?: () => void;
  onAddReport?: (id: string) => void;
  onVerify?: (projectId: string) => void;
}
