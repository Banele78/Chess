
import { useAppContext } from '../../../context/Context';
import { takeBack } from '../../../reducer/actions/move';

const TakeBack = () => {

    const { providerState: {dispatch} } = useAppContext();

    return <div>
        <button onClick={() => dispatch(takeBack())}>Take Back</button>
    </div>
}

export default TakeBack