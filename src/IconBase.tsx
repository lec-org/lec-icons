/** 品牌图标共用的 SVG 容器，统一尺寸与无障碍名称。 */
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'children' | 'dangerouslySetInnerHTML' | 'viewBox'> {
  /** 默认 20px，可传数字或 CSS 尺寸。width、height 可分别覆盖。 */
  size?: number | string;
  /** 图标独立表达含义时填写，旁边已有文字时可省略。 */
  title?: string;
}

interface IconBaseProps extends IconProps {
  viewBox: string;
  children: ReactNode;
}

export function IconBase({ size = 20, title, viewBox, children, ...props }: IconBaseProps) {
  const label = props['aria-label'] ?? title;
  const named = Boolean(label || props['aria-labelledby']);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      focusable="false"
      role={named ? 'img' : undefined}
      aria-hidden={named ? undefined : true}
      aria-label={label}
      {...props}
      viewBox={viewBox}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
