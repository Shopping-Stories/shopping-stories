import Header from '@components/Header';
// import ColorBackground from "@components/ColorBackground";
// import ImageBackground from "@components/ImageBackground";
// import Box from "@mui/material/Typography";
// import CssBaseline from "@mui/material/CssBaseline";


export default function Layout({children}:any) {
    // console.log(children?.props?.title)
    return (
        <>
            {/*<CssBaseline/>*/}
            {children?.props?.title && <Header title={children.props.title}/>}
            {children}
        </>
    )
}