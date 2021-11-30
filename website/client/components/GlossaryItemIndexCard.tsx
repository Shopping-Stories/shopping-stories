import { Storage } from 'aws-amplify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { GlossaryItem } from 'client/types';
import { useEffect, useState } from 'react';
import CardActions from '@mui/material/CardActions';
import MuiNextLink from './MuiNextLink';
import { handlePromise } from 'client/util';
import CardActionArea from '@mui/material/CardActionArea';

interface GlossaryItemIndexCardProps {
    item: GlossaryItem;
}

const GlossaryItemIndexCard = (props: GlossaryItemIndexCardProps) => {
    const { item } = props;
    const getImage = async (key: string): Promise<string> => {
        try {
            const S3imageUrl = await Storage.get(key);
            const imageReq = new Request(S3imageUrl);
            const [res, _imageNotFound] = await handlePromise(fetch(imageReq));
            if (res && res.status === 200) {
                return S3imageUrl;
            }
            return '';
        } catch (error: any) {
            console.error(error.message);
            return '';
        }
    };

    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        if (item.images.length > 0) {
            const key = item.images[0].imageKey;
            getImage(`images/${key}`).then((res) => setImageURL(res));
        }
    }, [item.images]);

    return (
        <Card>
            <CardActionArea href={`/glossary/items/${item.id}`}>
                <CardHeader title={item.name} />
                {item.images.length > 0 && imageURL && (
                    <CardMedia component="img" image={imageURL} />
                )}
                <CardContent>
                    {item.description.length > 100
                        ? item.description.substring(0, 100) + '...'
                        : item.description}
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ justifyContent: 'center' }}>
                <MuiNextLink href={`/glossary/items/${item.id}`}>
                    View Item
                </MuiNextLink>
            </CardActions>
        </Card>
    );
};

export default GlossaryItemIndexCard;
