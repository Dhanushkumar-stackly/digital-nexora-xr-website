export type TCommonProps = {
  title?: string;
  name?: string;
  icon?: string;
};

export type TNavLink = {
  id: string;
} & Required<Pick<TCommonProps, "title">>;

export type TMotion = {
  direction: "up" | "down" | "left" | "right" | "";
  type: "tween" | "spring" | "just" | "";
  delay: number;
  duration: number;
};
