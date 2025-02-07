export interface ColorGradient {
    _100: string
    _200: string
    _300: string
    _400: string
    _500: string
    _600: string
    _700: string
    _800: string
    _900: string
}

export interface ColorScheme {
    name: string
    primary: ColorGradient
    accent: ColorGradient
    neutral: ColorGradient
    warning: ColorGradient
    error: ColorGradient
    text: ColorGradient
    quote: string
    shadow: string
}

export namespace DefaultColorSchemes {
    export const lavenderDark: ColorScheme = {
        name: 'NavyBlueDark',
        primary: {
            _100: '#2a254d',
            _200: '#3d3563',
            _300: '#554a7c',
            _400: '#695b91',
            _500: '#7d6fa6',
            _600: '#927fb9',
            _700: '#a794cc',
            _800: '#b9a7db',
            _900: '#d1baf1',
        },
        accent: {
            _100: '#1a1c33',
            _200: '#292d52',
            _300: '#383e71',
            _400: '#474f90',
            _500: '#5660af',
            _600: '#6e78c6',
            _700: '#8690dd',
            _800: '#9ea8f4',
            _900: '#b6c0ff',
        },
        neutral: {
            _100: '#121018',
            _200: '#26222E',
            _300: '#343040',
            _400: '#423E52',
            _500: '#5C5870',
            _600: '#76728E',
            _700: '#908CAC',
            _800: '#AAA6CA',
            _900: '#C4C0E8',
        },
        warning: {
            _100: '#ffe6cc',
            _200: '#e6c099',
            _300: '#cca866',
            _400: '#b39033',
            _500: '#997800',
            _600: '#806000',
            _700: '#664800',
            _800: '#4d3600',
            _900: '#332400',
        },
        error: {
            _100: '#ff8080',
            _200: '#ee6666',
            _300: '#d34d4d',
            _400: '#b83333',
            _500: '#9c1a1a',
            _600: '#800000',
            _700: '#640000',
            _800: '#480000',
            _900: '#2c0000',
        },
        text: {
            _100: '#f4f4f4',
            _200: '#e6e6e6',
            _300: '#c8c8c8',
            _400: '#aaaaaa',
            _500: '#8c8c8c',
            _600: '#6e6e6e',
            _700: '#505050',
            _800: '#323232',
            _900: '#000000',
        },
        quote: '#e69d17',
        shadow: '#000000',
    }

    export const amoledNavyBlue: ColorScheme = {
        name: 'amodelNavyBlue',
        primary: {
            _100: '#2a254d',
            _200: '#3d3563',
            _300: '#554a7c',
            _400: '#695b91',
            _500: '#7d6fa6',
            _600: '#927fb9',
            _700: '#a794cc',
            _800: '#b9a7db',
            _900: '#d1baf1',
        },
        accent: {
            _100: '#1a1c33',
            _200: '#292d52',
            _300: '#383e71',
            _400: '#474f90',
            _500: '#5660af',
            _600: '#6e78c6',
            _700: '#8690dd',
            _800: '#9ea8f4',
            _900: '#b6c0ff',
        },
        neutral: {
            _100: '#000000',
            _200: '#101010',
            _300: '#242424',
            _400: '#3c3c3c',
            _500: '#5a5a5a',
            _600: '#747474',
            _700: '#8e8e8e',
            _800: '#a8a8a8',
            _900: '#c2c2c2',
        },
        warning: {
            _100: '#ffe6cc',
            _200: '#e6c099',
            _300: '#cca866',
            _400: '#b39033',
            _500: '#997800',
            _600: '#806000',
            _700: '#664800',
            _800: '#4d3600',
            _900: '#332400',
        },
        error: {
            _100: '#ff8080',
            _200: '#ee6666',
            _300: '#d34d4d',
            _400: '#b83333',
            _500: '#9c1a1a',
            _600: '#800000',
            _700: '#640000',
            _800: '#480000',
            _900: '#2c0000',
        },
        text: {
            _100: '#f4f4f4',
            _200: '#e6e6e6',
            _300: '#c8c8c8',
            _400: '#aaaaaa',
            _500: '#8c8c8c',
            _600: '#6e6e6e',
            _700: '#505050',
            _800: '#323232',
            _900: '#141414',
        },
        quote: '#e69d17',
        shadow: '#000000',
    }

    export const lavenderLight: ColorScheme = {
        name: 'NavyBlueLight',
        primary: {
            _100: '#e8e6ff',
            _200: '#cfcaff',
            _300: '#b6adff',
            _400: '#9e91ff',
            _500: '#8675ff',
            _600: '#6e5ae6',
            _700: '#5645cc',
            _800: '#3e2fb3',
            _900: '#271a99',
        },
        accent: {
            _100: '#f2f4ff',
            _200: '#d9dcff',
            _300: '#c0c4ff',
            _400: '#a7acff',
            _500: '#8e94ff',
            _600: '#767dde',
            _700: '#5e66bd',
            _800: '#464f9c',
            _900: '#2e387b',
        },
        neutral: {
            _100: '#EDEAF4', // Lightest - subtle lavender off-white
            _200: '#D8D4E6',
            _300: '#C4BED8',
            _400: '#B0A8CA',
            _500: '#9C92BB', // Midpoint - neutral gray with a lavender undertone
            _600: '#7D759A',
            _700: '#5E5878',
            _800: '#3F3B55',
            _900: '#211F33',
        },
        warning: {
            _100: '#fff5e6',
            _200: '#ffe0b3',
            _300: '#ffcc80',
            _400: '#ffb84d',
            _500: '#ffa31a',
            _600: '#e68f00',
            _700: '#cc7a00',
            _800: '#b36600',
            _900: '#995200',
        },
        error: {
            _100: '#ffe6e6',
            _200: '#ffb3b3',
            _300: '#ff8080',
            _400: '#ff4d4d',
            _500: '#ff1a1a',
            _600: '#e60000',
            _700: '#cc0000',
            _800: '#b30000',
            _900: '#990000',
        },
        text: {
            _100: '#000000',
            _200: '#323232',
            _300: '#505050',
            _400: '#6e6e6e',
            _500: '#8c8c8c',
            _600: '#aaaaaa',
            _700: '#c8c8c8',
            _800: '#e6e6e6',
            _900: '#f4f4f4',
        },
        quote: '#e69d17',
        shadow: '#000000',
    }
}
