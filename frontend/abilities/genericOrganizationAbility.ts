import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";

type Actions = "manage" | "create" | "read" | "update" | "delete";
type Subjects =
  | "Members"
  | "Teams"
  | "Interventions"
  | "Trees"
  | "Dashboard"
  | "all";

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export default function defineRulesFor(role: string) {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility);

  switch (role) {
    case "admin":
      can("manage", "all");
      break;
    case "manager":
      can("manage", ["Trees", "Interventions", "Teams"]);
      can(["create", "read", "update"], "Members");
      can("read", "Dashboard");
      break;
    case "contributor":
      can(["create", "read", "update"], ["Trees", "Interventions", "Teams"]);
      cannot("delete", ["Trees", "Interventions", "Teams"]);
      can("read", "Dashboard");
      cannot("manage", "Members");
      break;
    case "reader":
      can("read", "all");
      break;
    case "guest":
      cannot("manage", "all");
      break;
    default:
      cannot("manage", "all");
      break;
  }
  return rules;
}

export function buildAbilityFor(role: string): AppAbility {
  return new AppAbility(defineRulesFor(role), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    detectSubjectType: (object: any) => (object ? object.type : "all"),
  });
}
