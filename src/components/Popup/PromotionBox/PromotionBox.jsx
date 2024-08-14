import { useAppContext } from '../../../context/Context';
import { copyPosition, getNewMoveNotation } from '../../../helper';
import { clearCandidates, makeNewMove } from '../../../reducer/actions/move';
import './PromotionBox.css'

const PromotionBox = ({onClosePopup}) =>{
    const options = ['q', 'r', 'b', 'n'];
   

   const {providerState} = useAppContext();
   const {promotionSquare} = providerState.appState;
   
   if (!promotionSquare)
    return null

   const color = promotionSquare.x === 7 ? 'w' : 'b'

    const getPromotionPosition = () =>{
          const style = {}

        if(promotionSquare.x ===7)
            style.top = '-1.5%'
        //12
        else 
        style.top ='97.5%'

        if(promotionSquare.y<=1)
            style.left ='0%'
        else if (promotionSquare.y >- 6)
            style.right = '0%'
        else
            style.left = `${12.5 * promotionSquare.y - 20}%`

            return style
        
    }

    const onClick = option =>{
        onClosePopup()
        const newPosition = copyPosition(
           providerState.appState.position[providerState.appState.position.length - 1]
          );

        newPosition[promotionSquare.rank][promotionSquare.file] = ''
         newPosition[promotionSquare.x][promotionSquare.y] = color + option

         providerState.dispatch(clearCandidates());

         const newMove = getNewMoveNotation({
            ...promotionSquare,
            piece : color + 'p',
            promotesTo : option,
            position : providerState.appState.position[providerState.appState.position.length - 1]
         });
         providerState.dispatch(makeNewMove({newPosition,newMove}));
    }
     

    return <div className='popup-inner promotion-choices' style={getPromotionPosition()} >
        {options.map(option =>
             <div key={option}
             className={`piece ${color}${option}`}
             onClick ={() => onClick(option)}>

             </div>)}
    </div>
}

export default PromotionBox;