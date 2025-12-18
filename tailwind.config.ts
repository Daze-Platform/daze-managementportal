
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
			screens: {
				'xs': '475px',
				'3xl': '1600px',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
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
				},
				// Success/Warning/Info semantic colors
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))',
				},
				// Beach resort themed brand colors
				ocean: {
					DEFAULT: 'hsl(var(--ocean-blue))',
					light: 'hsl(var(--ocean-blue-light))',
					dark: 'hsl(var(--ocean-blue-dark))',
				},
				coral: {
					DEFAULT: 'hsl(var(--sunset-coral))',
					light: 'hsl(var(--sunset-coral-light))',
					dark: 'hsl(var(--sunset-coral-dark))',
				},
				sand: {
					DEFAULT: 'hsl(var(--sand-beige))',
					light: 'hsl(var(--sand-beige-light))',
					dark: 'hsl(var(--sand-beige-dark))',
				},
				teal: {
					DEFAULT: 'hsl(var(--tropical-teal))',
					light: 'hsl(var(--tropical-teal-light))',
					dark: 'hsl(var(--tropical-teal-dark))',
				},
				palm: {
					DEFAULT: 'hsl(var(--palm-green))',
					light: 'hsl(var(--palm-green-light))',
					dark: 'hsl(var(--palm-green-dark))',
				},
				brand: {
					blue: {
						DEFAULT: 'hsl(var(--brand-blue))',
						light: 'hsl(var(--brand-blue-light))',
						dark: 'hsl(var(--brand-blue-dark))',
					},
					orange: {
						DEFAULT: 'hsl(var(--brand-orange))',
						light: 'hsl(var(--brand-orange-light))',
						dark: 'hsl(var(--brand-orange-dark))',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
				'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.05)',
				'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.1)',
				'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
				'elevated-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
				'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
			},
			backdropBlur: {
				xs: '2px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(4px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(16px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					from: { opacity: '1', transform: 'translateY(0)' },
					to: { opacity: '0', transform: 'translateY(-4px)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'scale-out': {
					from: { opacity: '1', transform: 'scale(1)' },
					to: { opacity: '0', transform: 'scale(0.95)' }
				},
				'zoom-in': {
					from: { opacity: '0', transform: 'scale(0.9)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'zoom-out': {
					from: { opacity: '1', transform: 'scale(1)' },
					to: { opacity: '0', transform: 'scale(0.9)' }
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(100%)' }
				},
				'slide-in-left': {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' }
				},
				'slide-in-up': {
					from: { transform: 'translateY(100%)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-down': {
					from: { transform: 'translateY(-100%)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'shimmer': {
					from: { backgroundPosition: '-200% 0' },
					to: { backgroundPosition: '200% 0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'counter': {
					from: { '--num': '0' },
					to: { '--num': 'var(--target)' }
				},
				// New micro-interaction animations
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-2deg)' },
					'75%': { transform: 'rotate(2deg)' }
				},
				'press': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.97)' }
				},
				'pop': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'50%': { transform: 'scale(1.02)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0)' },
					'50%': { boxShadow: '0 0 20px 4px hsl(var(--primary) / 0.3)' }
				},
				'slide-up-fade': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'expand': {
					'0%': { transform: 'scaleX(0)', opacity: '0' },
					'100%': { transform: 'scaleX(1)', opacity: '1' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.5' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'check-bounce': {
					'0%': { transform: 'scale(0)' },
					'50%': { transform: 'scale(1.2)' },
					'100%': { transform: 'scale(1)' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'20%, 60%': { transform: 'translateX(-4px)' },
					'40%, 80%': { transform: 'translateX(4px)' }
				},
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'count-up': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.4s ease-out',
				'fade-out': 'fade-out 0.15s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.15s ease-out',
				'zoom-in': 'zoom-in 0.2s ease-out',
				'zoom-out': 'zoom-out 0.15s ease-out',
				'slide-in-right': 'slide-in-right 0.25s ease-out',
				'slide-out-right': 'slide-out-right 0.25s ease-out',
				'slide-in-left': 'slide-in-left 0.25s ease-out',
				'slide-in-up': 'slide-in-up 0.3s ease-out',
				'slide-in-down': 'slide-in-down 0.3s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'float': 'float 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'enter': 'fade-in 0.2s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.15s ease-out, scale-out 0.15s ease-out',
				// HeroUI-inspired micro-interactions
				'bounce-subtle': 'bounce-subtle 0.4s ease-in-out',
				'wiggle': 'wiggle 0.25s ease-in-out',
				'press': 'press 0.1s ease-in-out',
				'pop': 'pop 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-up-fade': 'slide-up-fade 0.3s ease-out',
				'expand': 'expand 0.25s ease-out',
				'ripple': 'ripple 0.5s ease-out',
				'check-bounce': 'check-bounce 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'shake': 'shake 0.3s ease-in-out',
				'spin-slow': 'spin-slow 3s linear infinite',
				'count-up': 'count-up 0.4s ease-out forwards',
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'snap': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
