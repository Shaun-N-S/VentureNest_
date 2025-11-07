export interface UserProfileUpdateDTO {
  userName?: string;
  profileImg?: string;
  bio?: string;
  website?: string;
  linkedInUrl?: string;
}

export interface UserProfileUpdateModelDTO {
  userName?: string;
  bio?: string;
  website?: string;
  linkedInUrl?: string;
}

export interface UserProfileUpdateReqDTO {
  id: string;
  profileImg?: File;
  formData?: UserProfileUpdateModelDTO;
}

export interface UserProfileUpdateResDTO {
  userName?: string;
  bio?: string;
  profileImg?: string;
  website?: string;
  linkedInUrl?: string;
  adminVerified?: boolean;
}
