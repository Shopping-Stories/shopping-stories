import { NextPage } from 'next';
import useAuth, { isInGroup } from '@hooks/useAuth.hook';
import { Roles } from 'config/constants.config';
import ColorBackground from '@components/ColorBackground';
import DashboardPageSkeleton from '@components/DashboardPageSkeleton';
import Header from '@components/Header';
import Paper from '@mui/material/Paper';
import { PaperStylesSecondary } from 'styles/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState,
    // useEffect
} from "react";

const UpdateItemsPeoplePage: NextPage = () => {
    const { groups,
        // loading
    } = useAuth('/', [Roles.Admin]);
    const isAdmin = isInGroup(Roles.Admin, groups);
    const isAdminOrModerator = isInGroup(Roles.Moderator, groups) || isAdmin;

    const [peopleUploadMsg, setPeopleUploadMsg] = useState("");
    const [itemUploadMsg, setItemUploadMsg] = useState("");

    interface sfile {
        file: string
        name: string
    }

    interface fileUploads {
        files: Array<sfile>
    }

    const getBase64 = (file: Blob, cb: (content: string | ArrayBuffer | null) => void) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const doUpload = async (toUp: fileUploads, msg: number) => {
        // console.log(JSON.stringify(toUp["files"][0]));
        const upload_url = "https://api.preprod.shoppingstories.org:443/upload_document/";
        const res = await fetch(upload_url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toUp["files"][0])
        });

        const text = await res.json();
        console.log(text);
        if (msg == 0)
        {
            setPeopleUploadMsg(text.message);
        }
        else
        {
            setItemUploadMsg(text.message);
        }
    }

    const handlePeopleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files == null) {
            return;
        }

        const files: Array<sfile> = [];

        for (let ix = 0; ix < e.target.files.length; ix++) {
            const file = e.target.files[ix];
            getBase64(file, (content) => {
                if ((content != null) && (typeof content == typeof "asdas")) {
                    const f: sfile = { "file": (content as unknown as string).split(",")[1], "name": "peopleIndex.xlsx" }
                    files.push(f)
                    if (ix == e.target.files!.length! - 1) {
                        const toUpload: fileUploads = { files: files };
                        doUpload(toUpload, 0);
                    }
                }
            });
        }
    }

    const handleItemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files == null) {
            return;
        }

        const files: Array<sfile> = [];

        for (let ix = 0; ix < e.target.files.length; ix++) {
            const file = e.target.files[ix];
            getBase64(file, (content) => {
                if ((content != null) && (typeof content == typeof "asdas")) {
                    const f: sfile = { "file": (content as unknown as string).split(",")[1], "name": "itemIndex.xlsx" }
                    files.push(f)
                    if (ix == e.target.files!.length! - 1) {
                        const toUpload: fileUploads = { files: files };
                        doUpload(toUpload, 1);
                    }
                }
            });
        }
    }

    return (
        <ColorBackground>
            <Header />
            <DashboardPageSkeleton groups={groups}>
                <Paper sx={PaperStylesSecondary}>
                <div>
                    <Typography
                        sx={{ textAlign: 'center' }}
                        variant="h4"
                    >
                        Update Items and People
                    </Typography>
                </div>
                <Paper sx={{ p: '1rem' }}>
                    <p>Update the list of people here:</p>
                    {isAdminOrModerator && 
                    (<>
                    <Button variant="contained" sx={{ width: "16vw", marginBottom: "1vh"}} component="label" hidden={!isAdminOrModerator}>
                        <Typography fontSize={"1.5vh"} color="secondary.contrastText">
                            Update People
                        </Typography>
                        <input hidden multiple type="file" onChange={handlePeopleUpload}/>
                    </Button>
                    </>)
                    }
                    {peopleUploadMsg && <p>{peopleUploadMsg}</p>}
                    <p>Update the list of items here:</p>
                    {isAdminOrModerator && 
                    (<>
                    <Button variant="contained" sx={{ width: "16vw", marginBottom: "1vh"}} component="label" hidden={!isAdminOrModerator}>
                        <Typography fontSize={"1.5vh"} color="secondary.contrastText">
                            Update Items
                        </Typography>
                        <input hidden multiple type="file" onChange={handleItemUpload}/>
                    </Button>
                    </>)
                    }
                    {itemUploadMsg && <p>{itemUploadMsg}</p>}
                </Paper>
                </Paper>
            </DashboardPageSkeleton>
        </ColorBackground>
    );

};

export default UpdateItemsPeoplePage;