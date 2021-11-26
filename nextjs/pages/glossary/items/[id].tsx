import ColorBackground from '@components/ColorBackground';
import GlossaryItemImageCard from '@components/GlossaryItemImageCard';
import Header from '@components/Header';
import InfoSection from '@components/InfoSection';
import LoadingPage from '@components/LoadingPage';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Storage } from 'aws-amplify';
import { FetchGlossaryItemDef } from 'client/graphqlDefs';
import { GlossaryItem } from 'client/types';
import { GlossaryItemQueryResult } from 'client/urqlConfig';
import { handlePromise, processStorageList } from 'client/util';
import { pickBy } from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';

const ItemGlossaryPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    const [findGlossaryItemResult, _findGlossaryItem] =
        useQuery<GlossaryItemQueryResult>({
            query: FetchGlossaryItemDef,
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
                    const keys = data.item.images.map(
                        (image: GlossaryItem['images'][0]) => image.imageKey,
                    );
                    for (const key of keys) {
                        const imageKey = imageKeys.find(
                            (imageKey: string) => imageKey === key,
                        );

                        if (imageKey) {
                            try {
                                const S3imageUrl = await Storage.get(
                                    `images/${imageKey}`,
                                );
                                const imageReq = new Request(S3imageUrl);
                                const [res, _imageNotFound] =
                                    await handlePromise(fetch(imageReq));
                                if (res && res.status === 200) {
                                    imagesFromS3.push(S3imageUrl);
                                }
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
        return <LoadingPage />;
    } else if (findGlossaryItemResult.data) {
        const {
            name,
            description,
            origin,
            use,
            category,
            subcategory,
            qualifiers,
            culturalContext,
            citations,
        } = findGlossaryItemResult.data.item;

        const data = {
            Description: description,
            Origin: origin,
            Use: use,
            Category: category,
            Subcategory: subcategory,
            'Cultural Context': culturalContext,
            Citations: citations,
            Qualifiers: qualifiers,
        };

        const cleanedObject = pickBy(data, (value, _) => Boolean(value));

        return (
            <ColorBackground>
                <Header />
                <Paper
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={12}>
                            <Button href="/glossary/items/">
                                Back item glossary
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h2">{name}</Typography>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Stack spacing={2}>
                                {images.map((image: any, i: number) =>
                                    findGlossaryItemResult.data ? (
                                        <GlossaryItemImageCard
                                            index={i}
                                            key={i}
                                            imageUrl={image}
                                            item={
                                                findGlossaryItemResult.data
                                                    ?.item
                                            }
                                        />
                                    ) : null,
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <Stack spacing={2}>
                                {Object.entries(cleanedObject).map(
                                    ([key, value]: string[], i: number) => (
                                        <div key={i}>
                                            <InfoSection
                                                label={key}
                                                body={value}
                                            />
                                            <br />
                                        </div>
                                    ),
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </ColorBackground>
        );
    } else {
        router.replace('/404');
        return <>error</>;
    }
};

export default ItemGlossaryPage;
