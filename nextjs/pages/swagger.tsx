import { NextPage } from 'next';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerPage: NextPage = () => (
	<SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
);

export default SwaggerPage;
