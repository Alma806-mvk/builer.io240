import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Design System Colors
				'bg-primary': 'hsl(var(--background-primary))',
				'bg-secondary': 'hsl(var(--background-secondary))',
				'bg-tertiary': 'hsl(var(--background-tertiary))',
				'bg-glass': 'hsl(var(--background-glass))',
				
				'text-primary': 'hsl(var(--text-primary))',
				'text-secondary': 'hsl(var(--text-secondary))',
				'text-tertiary': 'hsl(var(--text-tertiary))',
				'text-quaternary': 'hsl(var(--text-quaternary))',
				
				'accent-purple': 'hsl(var(--accent-purple))',
				'accent-cyan': 'hsl(var(--accent-cyan))',
				'accent-success': 'hsl(var(--accent-success))',
				'accent-warning': 'hsl(var(--accent-warning))',
				'accent-error': 'hsl(var(--accent-error))',
				
				'hover-overlay': 'hsl(var(--hover-overlay))',
				'active-overlay': 'hsl(var(--active-overlay))',
				'focus-ring': 'hsl(var(--focus-ring))',
				
				'border-primary': 'hsl(var(--border-primary))',
				'border-secondary': 'hsl(var(--border-secondary))',
				'border-accent': 'hsl(var(--border-accent))',
				
				// Legacy shadcn compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			spacing: {
				'space-xs': 'var(--space-xs)',
				'space-sm': 'var(--space-sm)', 
				'space-md': 'var(--space-md)',
				'space-lg': 'var(--space-lg)',
				'space-xl': 'var(--space-xl)',
				'space-2xl': 'var(--space-2xl)',
				'space-3xl': 'var(--space-3xl)',
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)',
				xl: 'var(--radius-xl)',
			},
			boxShadow: {
				'design-sm': 'var(--shadow-sm)',
				'design-md': 'var(--shadow-md)',
				'design-lg': 'var(--shadow-lg)',
				'design-xl': 'var(--shadow-xl)',
				'design-glow': 'var(--shadow-glow)',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-primary-muted': 'var(--gradient-primary-muted)',
				'gradient-text': 'var(--gradient-text)',
			},
			transitionDuration: {
				'fast': '150ms',
				'normal': '200ms', 
				'slow': '300ms',
			},
			transitionTimingFunction: {
				'design': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
