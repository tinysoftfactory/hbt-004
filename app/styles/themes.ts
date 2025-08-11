type FontWeight =
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
type FontWeightKey =
    | 'ultraLight'
    | 'light'
    | 'regular'
    | 'medium'
    | 'semiBold'
    | 'bold'
    | 'extraBold'
    | 'heavy';

const commonFont = {
    // family: {
    //     regular: 'Baloo2',
    //     medium: 'Baloo2-Medium',
    //     semiBold: 'Baloo2-SemiBold',
    //     bold: 'Baloo2-Bold',
    //     extraBold: 'Baloo2-ExtraBold',
    // },
    size: {
        xs: {
            S_0: 9,
            M_390: 10,
            L_744: 13,
            XXL_1024: 17,
        },
        s: {
            S_0: 12,
            M_390: 13,
            L_744: 16,
            XXL_1024: 21,
        },
        m: {
            S_0: 13,
            M_390: 14,
            L_744: 18,
            XXL_1024: 24,
        },
        l: {
            S_0: 15,
            M_390: 16,
            L_744: 21,
            XXL_1024: 27,
        },
        xl: {
            S_0: 17,
            M_390: 18,
            L_744: 23,
            XXL_1024: 31,
        },
        xxl: {
            S_0: 18,
            M_390: 20,
            L_744: 26,
            XXL_1024: 34,
        },
        xxxl: {
            S_0: 20,
            M_390: 22,
            L_744: 29,
            XXL_1024: 37,
        },
        xxxxl: {
            S_0: 22,
            M_390: 25,
            L_744: 33,
            XXL_1024: 42,
        },
        xxxxxl: {
            S_0: 25,
            M_390: 27,
            L_744: 35,
            XXL_1024: 46,
        },
        ds: {
            S_0: 27,
            M_390: 28,
            L_744: 38,
            XXL_1024: 48,
        },
        dm: {
            S_0: 29,
            M_390: 30,
            L_744: 40,
            XXL_1024: 52,
        },
        dx: {
            S_0: 46,
            M_390: 48,
            L_744: 54,
            XXL_1024: 58,
        },
        dxx: {
            S_0: 64,
            M_390: 70,
            L_744: 86,
            XXL_1024: 96,
        },
        dxxxxl: {
            S_0: 86,
            M_390: 90,
            L_744: 117,
            XXL_1024: 152,
        },
    },
    weight: {
        ultraLight: '200',
        light: '300',
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
        extraBold: '800',
        heavy: '900',
    } as Record<FontWeightKey, FontWeight>,
};

const commonColors = {
    textLight: '#7a828f',
    gray09: '#F5F7F8',
    gray10: '#f6f6f6',
    gray15: '#e6e6e6',
    gray20: '#e1e1e1',
    gray30: '#d8d8d8',
    gray40: '#d4d4d4',
    gray45: '#b5b5b5',
    gray50: '#959595',
    gray60: '#8b8b8b',
    gray70: '#7a7a7a',
    gray80: '#696969',
    gray90: '#4c4c4c',
    gray100: '#353e44',
    success: '#8fd884',
    success150: '#73c164',
    error: '#ff8075',
    warning: '#ffe375',
    error50: '#ffbbb4',
};

export const lightTheme = {
    colors: {
        ...commonColors,
        background: '#f7fffe',
        noBackground: '#fff',
        card: '#f5f7f8',
        primary10: '#e4f4f0',
        primary50: '#b5eadc',
        primary: '#8ed6c4',
        primary150: '#6cbca8',
        text: '#4f6d8a',
        textLightSupport: '#7d96b3',
        textDisabled: '#b1becd',
    },
    fonts: {
        ...commonFont,
    },
};

export const darkTheme = {
    colors: {
        ...commonColors,
        background: '#3b4e4b',
        noBackground: '#464948',
        card: '#618c6c',
        primary10: '#c5f4d7',
        primary50: '#67dd95',
        primary: '#35bd6a',
        primary150: '#207841',
        text: '#fbf4df',
        textLightSupport: '#d3cbbe',
        textDisabled: '#d2e4f8',
    },
    fonts: {
        ...commonFont,
    },
};
