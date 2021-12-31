import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";

export type Actions =
  | "preview"
  | "read"
  | "create"
  | "update"
  | "delete"
  | "manage";

export type Subjects =
  | "Members"
  | "Teams"
  | "Interventions"
  | "Trees"
  | "Dashboard"
  | "OpenDashboard"
  | "Organization"
  | "all";

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export default function defineRulesFor(role: string) {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility);

  switch (role) {
    case "admin":
    case "owner":
      can(["manage", "create", "read", "update", "preview"], "all");
      break;
    case "manager":
      can("manage", ["Trees", "Interventions", "Teams"]);
      can(["create", "read", "update"], "Members");
      can("read", "Dashboard");
      can("read", "Organization");
      can("preview", "all");
      break;
    case "contributor":
      can(["create", "read", "update"], ["Trees", "Interventions"]);
      cannot("delete", ["Trees", "Interventions", "Teams"]);
      can("read", "Teams");
      can("read", "Dashboard");
      cannot("manage", "Members");
      can("read", "Organization");
      can("preview", "all");
      break;
    case "reader":
      cannot(["create", "update", "delete", "manage"], "all");
      can("read", "all");
      can("preview", "all");
      break;
    case "guest":
      can(["preview"], ["Trees"]);
      can(["read"], ["OpenDashboard"]);
      // can(["read"], ["OpenDashboard", "Trees"]);
      // cannot(["manage", "create", "update"], ["Trees", "OpenDashboard"]);
      // cannot(
      //   ["manage", "create", "read", "update"],
      //   [
      //     "Members",
      //     "Teams",
      //     "Interventions",
      //     "Trees",
      //     "Dashboard",
      //     "Organization",
      //   ]
      // );
      break;
    default:
      can(["preview"], "all");
      cannot(["create", "read", "update", "delete", "manage"], "all");
      break;
  }
  return rules;
}

export function buildAbilityFor(role: string): AppAbility {
  return new AppAbility(defineRulesFor(role ? role : "guest"), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    detectSubjectType: (object: any) => (object ? object.type : "all"),
  });
}
