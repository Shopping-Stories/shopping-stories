import Header from '@components/Header';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'

// import ColorBackground from "@components/ColorBackground";
// import ImageBackground from "@components/ImageBackground";
// import Box from "@mui/material/Typography";
// import Toolbar from "@mui/material/Toolbar";

export default function Layout({children}:any) {
    // console.log(children?.props?.title)
    return (
        <Box >
        <Grid container wrap={"wrap"}>
            <Grid item xs={12}>
                {children?.props?.title && (<Header title={children.props.title}/>)}
                {/*<Header title={children.props.title ? children.props.title : undefined}/>*/}
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
        </Box>
    )
}