// export interface ProfileCardProps {
//   userName: string;
//   title: string;
// bio: string;
// profileImg: string;
//   verified?: boolean;
//   stats: {
//     posts: number;
//     followers: number;
//     following: number;
//   };
// onFollow?: () => void;
// isFollowing?: boolean;
// }

export interface ProfileCardProps {
  userData: {
    userName: string;
    bio?: string;
    website?: string;
    profileImg?: string;
    adminVerified?: boolean;
    linkedInUrl?: string;
  };
  isFollowing: boolean;
  onFollow: () => void;
}
