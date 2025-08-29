// FILE: theme/navigationThemes.ts
import { Theme } from '@react-navigation/native';
import { palette } from './palette';

export const releveDarkTheme: Theme = {
    dark: true,
    colors: {
        primary: palette.gold,
        background: palette.background,
        card: palette.surface,
        text: 'white',
        border: palette.border,
        notification: palette.vinotinto,
    },
};

export const releveLightTheme: Theme = {
    dark: false,
    colors: {
        primary: palette.vinotinto,
        background: '#FFFFFF',
        card: '#F8F8F8',
        text: '#11181C',
        border: '#E6E6E6',
        notification: palette.gold,
    },
};