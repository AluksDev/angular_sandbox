import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "dashboard",
    title: "Inici",
    type: "basic",
    icon: "house",
    link: "/map",
    meta: {
      requiredServices: null,
    },
  },
];
