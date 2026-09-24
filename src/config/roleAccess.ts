type OrgRole = "owner" | "admin" | "dentist" | "receptionist" | "hygienist" | "assistant" | "accountant" | "lab_technician" | "lab_assistant";

// Maps each relative dashboard path to the org roles that can access it
export const PAGE_ROLE_ACCESS: Record<string, OrgRole[]> = {
  "dashboard": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician", "lab_assistant"],
  "patients": ["owner", "admin", "dentist", "receptionist", "hygienist"],
  "appointments": ["owner", "admin", "dentist", "receptionist", "hygienist"],
  "dental-charts": ["owner", "admin", "dentist", "hygienist"],
  "treatments": ["owner", "admin", "dentist"],
  "prescriptions": ["owner", "admin", "dentist"],
  "billing": ["owner", "admin", "receptionist", "accountant"],
  "reports": ["owner", "admin", "accountant"],
  "revenue-allocation": ["owner", "admin"],
  "lab-work": ["owner", "admin", "dentist"],
  "lab": ["owner", "admin", "lab_technician", "lab_assistant"],
  "lab/cases": ["owner", "admin", "lab_technician", "lab_assistant"],
  "lab/technicians": ["owner", "admin", "lab_technician", "lab_assistant"],
  "lab/billing": ["owner", "admin", "lab_technician", "lab_assistant"],
  "lab/settings": ["owner", "admin"],
  "staff": ["owner", "admin"],
  "inventory": ["owner", "admin", "receptionist"],
  "notifications": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician", "lab_assistant"],
  "settings": ["owner", "admin"],
  "subscription": ["owner", "admin"],
  "profile": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician", "lab_assistant"],
  "tutorials": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician", "lab_assistant"],
  "messages": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician", "lab_assistant"],
  "reviews": ["owner", "admin", "receptionist"],
  "expenses": ["owner", "admin", "accountant"],
  "payment-plans": ["owner", "admin", "receptionist", "accountant"],
  "estimates": ["owner", "admin", "dentist", "receptionist"],
  "commissions": ["owner", "admin"],
  "profitability": ["owner", "admin", "accountant"],
  "inventory-costs": ["owner", "admin"],
  "audit-log": ["owner", "admin"],
  "consent-forms": ["owner", "admin", "dentist"],
  "documents": ["owner", "admin"],
  "automation": ["owner", "admin"],
  "website-settings": ["owner", "admin"],
  "waiting-list": ["owner", "admin", "dentist", "receptionist", "hygienist"],
  "schedules": ["owner", "admin", "dentist"],
  "suppliers": ["owner", "admin"],
  "purchase-orders": ["owner", "admin", "receptionist"],
  "treatment-materials": ["owner", "admin", "dentist"],
  "analytics": ["owner", "admin"],
  "marketing": ["owner", "admin", "receptionist"],
  "marketing/email": ["owner", "admin", "receptionist"],
  "marketing/sms": ["owner", "admin", "receptionist"],
  "marketing/social": ["owner", "admin"],
  "marketing/reviews": ["owner", "admin", "receptionist"],
  "marketing/promotions": ["owner", "admin"],
  "marketing/recall": ["owner", "admin", "receptionist"],
  "marketing/analytics": ["owner", "admin"],
  // Diagnostic centre — laboratory
  "diagnostics": ["owner", "admin", "lab_technician", "lab_assistant", "dentist"],
  "diagnostics/forms": ["owner", "admin", "lab_technician", "lab_assistant", "receptionist"],
  "diagnostics/forms/new": ["owner", "admin", "lab_technician", "lab_assistant", "receptionist"],
  "diagnostics/results": ["owner", "admin", "lab_technician", "lab_assistant", "receptionist", "dentist"],
  "diagnostics/tests": ["owner", "admin", "lab_technician"],
  "diagnostics/scientists": ["owner", "admin", "lab_technician"],
  "diagnostics/settings": ["owner", "admin"],
  // Diagnostic centre — imaging
  "imaging": ["owner", "admin", "lab_technician", "lab_assistant", "dentist"],
  "imaging/patients": ["owner", "admin", "lab_technician", "lab_assistant", "receptionist"],
  "imaging/scans": ["owner", "admin", "lab_technician", "lab_assistant", "dentist"],
  "imaging/register": ["owner", "admin", "lab_technician", "lab_assistant", "receptionist"],
  "imaging/appointments": ["owner", "admin", "lab_technician", "lab_assistant", "receptionist"],
  "imaging/activity": ["owner", "admin", "lab_technician"],
  // Diagnostic centre — pharmacy
  "pharmacy/drugs": ["owner", "admin", "receptionist", "assistant"],
  "pharmacy/dispensing": ["owner", "admin", "receptionist", "assistant"],
  // Eye clinic
  "eye": ["owner", "admin", "dentist", "hygienist", "receptionist"],
  "eye/exams": ["owner", "admin", "dentist", "hygienist"],
  "eye/prescriptions": ["owner", "admin", "dentist", "hygienist"],
  "eye/contact-lenses": ["owner", "admin", "dentist", "hygienist", "assistant"],
  "eye/orders": ["owner", "admin", "receptionist", "assistant"],
  "eye/diagnostics": ["owner", "admin", "dentist", "hygienist", "lab_technician"],
  "eye/reports": ["owner", "admin", "dentist", "hygienist", "lab_technician"],
  "eye/charts": ["owner", "admin", "dentist", "hygienist", "lab_technician"],
  "eye/surgery": ["owner", "admin", "dentist", "receptionist"],
};

/**
 * Eye clinics: menus by job.
 * receptionist = Front desk, hygienist = Optometrist, dentist = Doctor,
 * assistant = Optician, accountant = Cashier.
 */
const FRONT: OrgRole[] = ["receptionist"];
const OPTOM: OrgRole[] = ["dentist", "hygienist"];
const OPTICIAN: OrgRole[] = ["assistant"];
const CASHIER: OrgRole[] = ["accountant"];
const ALL_EYE: OrgRole[] = [...FRONT, ...OPTOM, ...OPTICIAN, ...CASHIER, "lab_technician", "lab_assistant"];

export const EYE_PAGE_ROLE_ACCESS: Record<string, OrgRole[]> = {
  "dashboard": ALL_EYE,
  "eye": [...FRONT, ...OPTOM],
  "patients": [...FRONT, ...OPTOM, ...OPTICIAN, ...CASHIER],
  "appointments": [...FRONT, ...OPTOM],
  "waiting-list": [...FRONT, ...OPTOM],
  "schedules": [...FRONT, ...OPTOM],
  "eye/flow": [...FRONT, ...OPTOM, ...OPTICIAN, ...CASHIER],
  "eye/visit": OPTOM,
  "eye/records": OPTOM,
  "eye/exams": OPTOM,
  "eye/prescriptions": [...OPTOM, ...OPTICIAN],
  "prescriptions": OPTOM,
  "eye/contact-lenses": [...OPTOM, ...OPTICIAN],
  "eye/orders": [...OPTICIAN, ...FRONT],
  "eye/pickup": [...OPTICIAN, ...FRONT],
  "eye/stock": [...OPTICIAN],
  "eye/diagnostics": [...OPTOM, "lab_technician"],
  "eye/reports": [...OPTOM, "lab_technician"],
  "eye/charts": [...OPTOM, "lab_technician"],
  "eye/surgery": [...OPTOM, ...FRONT],
  "eye/surgery-checklists": OPTOM,
  "eye/referrals": [...OPTOM, ...FRONT],
  "consent-forms": [...FRONT, ...OPTOM],
  "reviews": FRONT,
  "billing": [...CASHIER, ...FRONT],
  "estimates": [...CASHIER, ...FRONT],
  "payment-plans": CASHIER,
  "expenses": CASHIER,
  "revenue-allocation": CASHIER,
  "profitability": CASHIER,
  "reports": CASHIER,
  "analytics": [],
  "inventory": OPTICIAN,
  "suppliers": OPTICIAN,
  "purchase-orders": OPTICIAN,
  "shop-management": OPTICIAN,
  "staff": [], "documents": [...FRONT], "audit-log": [], "website-settings": [],
};

/**
 * Check if a user's org role allows access to a relative page path.
 * orgRole is the user's role within the current organization.
 */
export function hasPageAccess(orgRole: string, relativePath: string, clinicType?: string): boolean {
  if (orgRole === "owner" || orgRole === "admin") return true;
  const map = clinicType === "eye" ? { ...PAGE_ROLE_ACCESS, ...EYE_PAGE_ROLE_ACCESS } : PAGE_ROLE_ACCESS;
  // Handle patient profile sub-routes
  if (relativePath.startsWith("patients/")) {
    return map["patients"]?.includes(orgRole as OrgRole) ?? false;
  }
  const allowed = map[relativePath.split("?")[0]];
  if (!allowed) return true; // unknown paths are accessible
  return allowed.includes(orgRole as OrgRole);
}

/**
 * Extract relative path from full pathname.
 * e.g. "/clinic/my-clinic/patients" -> "patients"
 */
export function extractRelativePath(pathname: string): string {
  const match = pathname.match(/^\/clinic\/[^/]+\/(.+)$/);
  return match ? match[1] : "dashboard";
}

const EYE_ROLE_LABELS: Record<string, string> = {
  receptionist: "Front desk",
  hygienist: "Optometrist",
  dentist: "Doctor / Optometrist",
  assistant: "Optician",
  accountant: "Cashier",
};

export function getRoleLabel(role: string, clinicType?: string): string {
  if (clinicType === "eye" && EYE_ROLE_LABELS[role]) return EYE_ROLE_LABELS[role];
  const labels: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    dentist: "Dentist",
    receptionist: "Receptionist",
    hygienist: "Hygienist",
    assistant: "Assistant",
    accountant: "Accountant",
    lab_technician: "Lab Technician",
    lab_assistant: "Lab Assistant",
    super_admin: "Super Admin",
    user: "User",
  };
  return labels[role] || role;
}
