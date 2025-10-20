import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "dashboard",
    title: "Inicio",
    type: "basic",
    icon: "house",
    link: "/map",
    meta: {
      requiredServices: null,
    },
  },
];
