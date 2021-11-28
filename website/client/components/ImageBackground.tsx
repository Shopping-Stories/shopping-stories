import backgrounds from 'styles/backgrounds.module.css';

type Props = { children?: React.ReactNode };

const ImageBackground = (props: Props) => {
    return <div className={backgrounds.imageBackground}>{props.children}</div>;
};

export default ImageBackground;
