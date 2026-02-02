export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stage: string;
  logoUrl?: string;
  likes?: number;
  liked?: boolean;
  isOwnProfile?: boolean;
  onLike?: (updateUI: (liked: boolean) => void) => void;

  onEdit?: () => void;
  onAddReport?: (id: string) => void;
  onVerify?: (projectId: string) => void;
  onRemove?: (projectId: string) => void;
}
