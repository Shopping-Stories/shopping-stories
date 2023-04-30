export const PaperStyles = {
    margin: '3rem',
    padding: '1rem',
};

export const PaperHeaderStyles = {
    marginLeft: '3rem',
    marginRight: '3rem',
    marginTop: '3rem',
    padding: '1rem'
}

export const PaperStylesSecondary = {
    backgroundColor: `var(--secondary-bg)`,
    margin: '3rem',
    padding: '2rem',
};

export const ButtonStyles = {
    '&.MuiButton-root': {
        backgroundColor: 'var(--button)',
        '&:hover': {
            backgroundColor: 'var(--button-hover)',
        },
    },
};

export const LogoFabStyles = {
    '&.MuiFab-root': {
        backgroundColor: 'var(--secondary)',
        '&:hover': {
            backgroundColor: 'var(--secondary-hover)',
        },
    },
};

export const LinkColor = {
    color: 'var(--text)',
    textDecorationColor: 'rgba(var(--text), 0.4)',
    '&:hover': {
        textDecorationColor: 'var(--text)',
    },
};
