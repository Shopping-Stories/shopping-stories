import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { GlossaryItem } from 'client/formikSchemas';
import { pickBy } from 'lodash';
import InfoSection from './InfoSection';
import MuiNextLink from './MuiNextLink';

interface GlossaryItemImageCardProps {
    imageUrl: string;
    item: GlossaryItem;
    index: number;
}

const GlossaryItemImageCard = (props: GlossaryItemImageCardProps) => {
    const { imageUrl, item, index } = props;
    const itemData = item.images[index];
    const { name, caption, collectionCitation, material, date, url, license, dimensions } =
        itemData;

    const data = {
        Caption: caption,
        'Collection Citation': collectionCitation,
        Material: material,
        Dimensions: dimensions,
        Date: date,
        License: license,
    };

    const cleanedObject = pickBy(data, (value, _) => Boolean(value));

    return (
        <Card>
            <CardMedia component="img" image={imageUrl} />
            <CardContent>
                {name && (
                    <Typography variant="h5" component="div">
                        {name}
                    </Typography>
                )}
                <br />
                {Object.entries(cleanedObject).map(
                    ([key, value]: string[], i: number) => (
                        <div>
                            <InfoSection
                                key={i}
                                label={key}
                                body={value}
                            />
                            <br />
                        </div>
                    ),
                )}
                {url && (
                    <Typography variant="body2" component="div">
                        <MuiNextLink
                            href={url}
                            aria-label="link to source of image"
                        >
                            Source URL
                        </MuiNextLink>
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default GlossaryItemImageCard;
