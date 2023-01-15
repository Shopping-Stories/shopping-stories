
import LoadingPage from '@components/LoadingPage';
import useAuth from '@hooks/useAuth.hook';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



interface urlList {
    strings: Array<string>
}

interface URLTable {
    handleClick: (event: React.MouseEvent, url: string) => void;
}

// const queryClient = new QueryClient();

const URLTable = (props: URLTable) => {
    const handleClick = props.handleClick;
    const url = "http://preprod.shoppingstories.org:4562/get_ready_URLs";

    const { loading } = useAuth();
    // const isAdmin = isInGroup(Roles.Admin, groups);
    // const isModerator = isInGroup(Roles.Moderator, groups);
    // const isAdminOrModerator = isAdmin || isModerator;
    // const [graph, setGraph] = useState(false)

    const getData = async (url: string) => {
        const res = await fetch(url);
        let qres = (JSON.parse(await res.text())) as urlList;

        return qres;
    }
    
    const {data} =
    useQuery(
        ["files", url],
        () => {
            // console.log("running request.") 
            let out =  getData(url)
            return out
        },
    );


    if (loading) {
        return <LoadingPage />;
    }
    
    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableCell align='center' sx={{fontSize: "2vh"}}>Files to review/edit:</TableCell>
            </TableHead>
            <TableBody>
                {/* <TableRow>
                    <TableCell align='center'>
                        1
                    </TableCell>
                </TableRow> */}
                {data?.strings.map((value, index) => {
                    if (value == undefined || value == null) {
                        return <TableRow key={index}><TableCell>No data</TableCell></TableRow>
                    }
                    return (
                        <TableRow key={index} hover onClick={(event) => handleClick(event, value)}>
                            <TableCell align='center' sx={{fontSize: "1.5vh"}}>
                                {value.split("/")[value.split("/").length - 1].replace(".json", "")}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
        </TableContainer>
    );
};

export default URLTable;
