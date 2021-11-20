import { Storage } from 'aws-amplify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { GlossaryItem } from 'client/formikSchemas';
import { useEffect, useState } from 'react';
import CardActions from '@mui/material/CardActions';
import MuiNextLink from './MuiNextLink';

interface GlossaryItemIndexCardProps {
    item: GlossaryItem;
}

const GlossaryItemIndexCard = (props: GlossaryItemIndexCardProps) => {
    const { item } = props;
    const getImage = async (key: string): Promise<string> => {
        try {
            return Storage.get(key);
        } catch (error: any) {
            console.log(error.message);
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
            <CardHeader title={item.name} />
            {item.images.length > 0 && imageURL && (
                <CardMedia component="img" image={imageURL} />
            )}
            <CardContent>
                {item.description.substring(0, 100) + '...'}
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <MuiNextLink href={`/glossary/item/${item.id}`}>
                    View Item
                </MuiNextLink>
            </CardActions>
        </Card>
    );
};

export default GlossaryItemIndexCard;
