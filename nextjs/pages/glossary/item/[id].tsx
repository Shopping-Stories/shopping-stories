import Header from '@components/Header';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { findGlossaryItemDef } from 'client/graphqlDefs';
import { handlePromise, processStorageList } from 'client/util';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';

const ItemGlossaryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const [findGlossaryItemResult, _findGlossaryItem] = useQuery({
        query: findGlossaryItemDef,
        variables: { id },
    });

    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        const getImage = async () => {
            if (findGlossaryItemResult.data) {
                const [res, err] = await handlePromise(Storage.list('images/'));

                if (!err && res) {
                    const { files: images } = processStorageList(res);
                    const imageKeys: string[] = images.map(
                        (image: any) => image.key.split('/')[1],
                    );

                    const imagesFromS3: any[] = [];

                    const data = findGlossaryItemResult.data;
                    const keys = data.findGlossaryItem.images.map(
                        (image: any) => image.thumbnailImage,
                    );
                    for (const key of keys) {
                        const imageKey = imageKeys.find(
                            (imageKey: string) => imageKey === key,
                        );

                        if (imageKey) {
                            try {
                                const S3image = await Storage.get(
                                    `images/${imageKey}`,
                                );
                                imagesFromS3.push(S3image);
                            } catch (error: any) {
                                console.error(error);
                            }
                        }
                    }
                    setImages(imagesFromS3);
                }
            }
        };

        getImage();
    }, [findGlossaryItemResult.data]);

    if (findGlossaryItemResult.fetching) {
        return (
            <div>
                <Header />
            </div>
        );
    } else if (findGlossaryItemResult.error) {
        router.push('/glossary');
        return <>error</>;
    } else {
        return (
            <div>
                <Header />
                <Paper
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2}>
                                {images.map((image: any, i: number) => (
                                    <Card key={i}>
                                        <CardMedia
                                            component="img"
                                            image={image}
                                        />
                                        <CardContent>
                                            <Typography variant="body2">
                                                {
                                                    findGlossaryItemResult.data
                                                        .findGlossaryItem
                                                        .images[i]
                                                        .thumbnailImage
                                                }
                                                <br />
                                                {'"a benevolent smile"'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Stack spacing={2}></Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
};

export default ItemGlossaryPage;
