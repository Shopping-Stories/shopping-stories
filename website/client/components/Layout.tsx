import Header from '@components/Header';
// import ColorBackground from "@components/ColorBackground";
// import ImageBackground from "@components/ImageBackground";
// import Box from "@mui/material/Typography";
// import CssBaseline from "@mui/material/CssBaseline";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import Toolbar from "@mui/material/Toolbar";
export default function Layout({children}:any) {
    // console.log(children?.props?.title)
    return (
        <Box >
        <Grid container wrap={"wrap"}>
            <Grid item xs={12}>
                {children?.props?.title && (<Header title={children.props.title}/>)}
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
        </Box>
    )
}