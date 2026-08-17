/** Types for the admin dashboard. Public-site types live in app/lib/types.ts. */

/** GET /api/auth/me/ */
export type AdminUser = {
  id: number;
  email: string;
  full_name: string;
  display_name: string;
  phone: string;
  avatar: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
};

export type ActivityAction = "CREATED" | "UPDATED" | "DELETED" | "SUBMITTED";

export type ActivityEntry = {
  id: number;
  action: ActivityAction;
  action_display: string;
  model_label: string;
  object_id: string;
  description: string;
  actor_name: string | null;
  created_at: string;
};

export type ApplicationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

export type RecentApplication = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  status_display: string;
  submitted_at: string;
};

/** GET /api/admin/dashboard/ */
export type DashboardSummary = {
  stats: {
    team_members: number;
    team_members_active: number;
    applications_total: number;
    applications_pending: number;
    events_total: number;
    events_upcoming: number;
    articles_total: number;
    articles_published: number;
    gallery_images: number;
    contact_messages: number;
  };
  recent_applications: RecentApplication[];
  recent_activity: ActivityEntry[];
};

/** Writable shape of a team member — mirrors `TeamMemberSerializer`. */
export type TeamMemberInput = {
  name: string;
  position: string;
  bio: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  display_order: number;
  is_active: boolean;
};

export type AdminTeamMember = TeamMemberInput & {
  id: number;
  profile_image: string | null;
};
