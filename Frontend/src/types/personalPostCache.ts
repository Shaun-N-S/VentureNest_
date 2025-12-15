import type { PersonalPost } from "../pages/Investor/Profile/InvestorProfile/ProfilePage";

export type PersonalPostCache = {
  data: {
    data: {
      posts: PersonalPost[];
      totalPosts: number;
    };
  };
};
