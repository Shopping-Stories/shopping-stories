import { NextPage } from "next"
import { useRouter } from "next/router"

const UpdateGlossaryItem: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;
    return <div>{id}</div>;
}

export default UpdateGlossaryItem