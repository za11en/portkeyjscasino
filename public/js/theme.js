tailwind.config = {
    theme: {
        extend: {
            colors: {
                neon: { pink: '#FF007A', purple: '#7000FF', cyan: '#00F0FF', yellow: '#FFD600' },
                dark: '#080112',
                card: '#160824'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        }
    }
}
