declare module "*.css";
declare module "*.module.css";
declare module "*.scss";
declare module "*.module.scss";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.jsx";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "react-checkmark" {
  import * as React from "react";

  export interface CheckmarkProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }

  export const Checkmark: React.FC<CheckmarkProps>;
  export default Checkmark;
}
