import Header from '@components/Header';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { NextPage } from 'next';
import Box from '@mui/material/Box';

const AboutPage: NextPage = () => {
    return (
        <>
            <Header />
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '50vh' }}
            >
                <Box
                    sx={{
                        width: '60%',
                        backgroundColor: 'primary.main',
                        textAlign: 'center',
                        // opacity: [0.9, 0.8, 0.7],
                        // '&:hover': {
                        // backgroundColor: 'primary.main',
                        // opacity: [0.9, 0.8, 0.7],
                        // },
                    }}
                >
                    <Typography variant="h2" component="h1">
                        Welcome to
                    </Typography>
                    <Typography variant="h1" component="h2" gutterBottom>
                        Shopping Stories
                    </Typography>
                    <Typography>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Dolor id dolores minima, voluptatibus commodi
                            rerum optio perferendis magnam itaque beatae minus
                            dolorum? Voluptatibus ipsum expedita illo reiciendis
                            porro, sed voluptates!
                        </p>
                        <p>
                            Voluptatem accusantium magni aliquam soluta,
                            nostrum, architecto cum dolores hic exercitationem
                            quia tenetur sunt modi delectus iure aspernatur
                            dolorem impedit mollitia! Qui quae eum quam delectus
                            asperiores neque? In, minus.
                        </p>
                        <p>
                            Illum perferendis dolore quas nisi suscipit qui
                            laboriosam enim, soluta beatae, consequatur error ea
                            maxime voluptatibus quisquam voluptatum molestias
                            non, recusandae ipsum sint aut odio aliquid velit.
                            Voluptate, ex culpa.
                        </p>
                        <p>
                            Animi, eveniet ratione odit soluta, obcaecati rem in
                            veniam facere explicabo temporibus voluptates
                            aspernatur praesentium fugit iste porro at aliquid
                            accusamus quam ipsa optio! Nobis ea provident
                            ratione tempore ducimus!
                        </p>
                        <p>
                            Blanditiis laborum assumenda nostrum quos fugit?
                            Dolore officia beatae suscipit debitis nesciunt
                            aliquam, placeat unde autem qui tenetur non possimus
                            explicabo hic saepe ducimus dignissimos quaerat
                            consectetur odio dicta? Cupiditate.
                        </p>
                        <p>
                            Animi commodi dolores laborum ea, fugiat expedita
                            autem cumque consequuntur sunt nemo repellendus fuga
                            quod quidem similique dignissimos cupiditate
                            obcaecati mollitia ullam, deleniti, quis porro
                            pariatur nihil atque! Voluptatem, eum!
                        </p>
                        <p>
                            Saepe esse repellendus quaerat iusto assumenda,
                            tenetur, vitae ratione doloribus in neque
                            dignissimos velit minus delectus, quas explicabo.
                            Dolor ab a doloremque commodi consequuntur,
                            dignissimos ratione tempora! Molestiae, quae eum?
                        </p>
                        <p>
                            Perspiciatis fugiat deserunt dicta quae quaerat
                            vitae eveniet perferendis odio dolores assumenda
                            reiciendis, doloremque, voluptatum animi dignissimos
                            voluptate neque veniam rerum in. Consequatur culpa
                            sequi numquam soluta cumque tempore corporis.
                        </p>
                        <p>
                            Voluptatem iusto quas recusandae doloribus, cumque
                            atque. Obcaecati, dicta possimus culpa quidem nobis
                            consectetur maiores explicabo corporis sequi!
                            Perferendis, neque adipisci. Error dolorum
                            consectetur dignissimos culpa quaerat obcaecati iste
                            reiciendis.
                        </p>
                        <p>
                            Labore consequuntur cumque alias in. Omnis esse
                            delectus rem necessitatibus. Ex est optio, amet nemo
                            voluptates eligendi impedit at sed et autem fuga,
                            quam rem laboriosam incidunt molestias maxime
                            itaque?
                        </p>
                        <p>
                            In adipisci vero voluptatum tempore nesciunt,
                            molestiae ipsum explicabo hic maiores praesentium
                            accusantium unde officia consequuntur excepturi
                            voluptatibus nostrum eligendi quam aliquam
                            consectetur ratione doloribus reiciendis! Amet,
                            deleniti! Veritatis, voluptate?
                        </p>
                        <p>
                            Molestiae minima neque ipsa, molestias facilis
                            veniam modi quis sit, quas cum dolores quae quisquam
                            dicta laudantium facere, sint amet! Amet repellendus
                            quod odit quas maxime fugit neque porro facere.
                        </p>
                        <p>
                            Illum ducimus fugiat, facere nisi totam ex tenetur
                            explicabo optio voluptatum. Repudiandae ut fugiat
                            perspiciatis similique sequi. Accusamus deleniti
                            provident ab saepe aut adipisci, vitae cum est,
                            perferendis reiciendis nulla.
                        </p>
                        <p>
                            Unde et sed nulla reprehenderit illum, voluptas sunt
                            eum id a vero modi placeat nam quisquam deleniti.
                            Dolore quam nesciunt soluta culpa labore, temporibus
                            delectus, saepe cum voluptates sit alias!
                        </p>
                    </Typography>
                </Box>
            </Grid>
        </>
    );
};

export default AboutPage;
