export interface AddProjectFormErrors {
  startupName?: string;
  shortDescription?: string;
  pitchDeckUrl?: string;
  projectWebsite?: string;
  userRole?: string;
  teamSize?: string;
  category?: string;
  stage?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  donationTarget?: string;
  submit?: string;
}

export interface AddProjectFormData {
  startupName: string;
  shortDescription: string;
  pitchDeckUrl: File | null;
  projectWebsite: string;
  userRole: string;
  teamSize: string;
  category: string;
  stage: string;
  logoUrl: File | null;
  coverImageUrl: File | null;
  location: string;
  donationEnabled: boolean;
  donationTarget: string;
}
