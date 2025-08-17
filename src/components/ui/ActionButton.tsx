import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const getVariantStyles = (variant: ButtonVariant): string => {
  const styles = {
    primary:
      "bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white border border-slate-600 hover:border-slate-500",
    success:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-xl",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl",
    warning:
      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl",
    info: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl",
  };
  return styles[variant];
};

const getSizeStyles = (size: ButtonSize): string => {
  const styles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };
  return styles[size];
};

const getIconSize = (size: ButtonSize): string => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  };
  return sizes[size];
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  type = "button",
  title,
}) => {
  const baseStyles =
    "font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const widthStyles = fullWidth ? "w-full" : "";

  const disabledStyles =
    disabled || loading
      ? "opacity-50 cursor-not-allowed hover:scale-100 shadow-none"
      : "";

  const iconSizeClass = getIconSize(size);

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconSizeClass} ${iconElement.props.className || ""}`,
      });
    }
    return iconElement;
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      className={`
        ${baseStyles}
        ${variantStyles}
        ${sizeStyles}
        ${widthStyles}
        ${disabledStyles}
        ${className}
      `.trim()}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && renderIcon(icon)}
          <span>{children}</span>
          {icon && iconPosition === "right" && renderIcon(icon)}
        </>
      )}
    </button>
  );
};

// Convenience components for common button types
export const PrimaryButton: React.FC<Omit<ActionButtonProps, "variant">> = (
  props,
) => <ActionButton {...props} variant="primary" />;

export const SecondaryButton: React.FC<Omit<ActionButtonProps, "variant">> = (
  props,
) => <ActionButton {...props} variant="secondary" />;

export const DangerButton: React.FC<Omit<ActionButtonProps, "variant">> = (
  props,
) => <ActionButton {...props} variant="danger" />;

export const SuccessButton: React.FC<Omit<ActionButtonProps, "variant">> = (
  props,
) => <ActionButton {...props} variant="success" />;

export default ActionButton;
