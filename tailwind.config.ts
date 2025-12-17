
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
						DEFAULT: 'hsl(var(--brand-blue))', // Ocean blue
						light: 'hsl(var(--brand-blue-light))',
						dark: 'hsl(var(--brand-blue-dark))',
					},
					orange: {
						DEFAULT: 'hsl(var(--brand-orange))', // Sunset coral
						light: 'hsl(var(--brand-orange-light))',
						dark: 'hsl(var(--brand-orange-dark))',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
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
