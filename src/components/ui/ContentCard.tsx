import React from "react";
import { ActionButton } from "./ActionButton";

type CardVariant =
  | "default"
  | "gradient"
  | "highlight"
  | "success"
  | "warning"
  | "error";
type CardSize = "sm" | "md" | "lg" | "xl";

interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;

  // Header actions
  headerActions?: React.ReactNode;
  onClose?: () => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;

  // Footer
  footer?: React.ReactNode;

  // Loading state
  loading?: boolean;

  // Interactive
  onClick?: () => void;
  hoverable?: boolean;
}

const getVariantStyles = (variant: CardVariant): string => {
  const styles = {
    default:
      "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50",
    gradient:
      "bg-gradient-to-br from-sky-500/20 to-purple-500/20 border-sky-500/30",
    highlight:
      "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30",
    success:
      "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    warning:
      "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/30",
    error: "bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30",
  };
  return styles[variant];
};

const getSizeStyles = (size: CardSize): string => {
  const styles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };
  return styles[size];
};

export const ContentCard: React.FC<ContentCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  variant = "default",
  size = "md",
  className = "",
  headerActions,
  onClose,
  collapsible = false,
  defaultExpanded = true,
  footer,
  loading = false,
  onClick,
  hoverable = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const baseStyles =
    "backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-300";
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const interactiveStyles =
    onClick || hoverable
      ? "cursor-pointer hover:shadow-3xl hover:border-slate-600/50 transform hover:scale-[1.02]"
      : "";

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles}
        ${sizeStyles}
        ${interactiveStyles}
        ${className}
      `.trim()}
      onClick={handleCardClick}
    >
      {/* Header */}
      {(title ||
        subtitle ||
        icon ||
        headerActions ||
        onClose ||
        collapsible) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 flex-grow">
            {icon && (
              <div className="p-3 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl shadow-lg">
                {React.isValidElement(icon)
                  ? React.cloneElement(icon, {
                      className: "h-8 w-8 text-white",
                    })
                  : icon}
              </div>
            )}

            {(title || subtitle) && (
              <div className="flex-grow">
                {title && (
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-slate-300 text-lg mt-1">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            {headerActions}

            {collapsible && (
              <button
                onClick={toggleExpanded}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <span
                  className={`transform transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
            )}

            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                title="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {(!collapsible || isExpanded) && (
        <div
          className={`transition-all duration-300 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
              <span className="ml-3 text-slate-400">Loading...</span>
            </div>
          ) : (
            children
          )}
        </div>
      )}

      {/* Footer */}
      {footer && (!collapsible || isExpanded) && (
        <div className="mt-6 pt-6 border-t border-slate-700/50">{footer}</div>
      )}
    </div>
  );
};

// Specialized card components
export const FeatureCard: React.FC<Omit<ContentCardProps, "variant">> = (
  props,
) => <ContentCard {...props} variant="gradient" />;

export const SuccessCard: React.FC<Omit<ContentCardProps, "variant">> = (
  props,
) => <ContentCard {...props} variant="success" />;

export const WarningCard: React.FC<Omit<ContentCardProps, "variant">> = (
  props,
) => <ContentCard {...props} variant="warning" />;

export const ErrorCard: React.FC<Omit<ContentCardProps, "variant">> = (
  props,
) => <ContentCard {...props} variant="error" />;

// Quick action card with built-in action buttons
interface ActionCardProps extends Omit<ContentCardProps, "footer"> {
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
  };
}

export const ActionCard: React.FC<ActionCardProps> = ({
  primaryAction,
  secondaryAction,
  ...props
}) => {
  const footer =
    primaryAction || secondaryAction ? (
      <div className="flex items-center justify-end space-x-3">
        {secondaryAction && (
          <ActionButton
            variant="secondary"
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            icon={secondaryAction.icon}
          >
            {secondaryAction.label}
          </ActionButton>
        )}
        {primaryAction && (
          <ActionButton
            variant="primary"
            onClick={primaryAction.onClick}
            loading={primaryAction.loading}
            disabled={primaryAction.disabled}
            icon={primaryAction.icon}
          >
            {primaryAction.label}
          </ActionButton>
        )}
      </div>
    ) : undefined;

  return <ContentCard {...props} footer={footer} />;
};

export default ContentCard;
