import backgrounds from 'styles/backgrounds.module.css';

type Props = { children?: React.ReactNode };

const ColorBackground = (props: Props) => {
    return <div className={backgrounds.colorBackground}>{props.children}</div>;
};

export default ColorBackground;
