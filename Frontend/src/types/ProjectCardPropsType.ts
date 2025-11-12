export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stage: string;
  logo: string;
  likes?: number;
  liked?: boolean;
  onLike?: () => void;
}
