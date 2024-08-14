import { isPlayerInCheck } from '../../arbiter/arbiter'
import { getKingposition } from '../../arbiter/getMoves'
import { useAppContext } from '../../context/Context'
import { getCharacter } from '../../helper'
import Pieces from '../Pieces/Pieces'
import Popup from '../Popup/Popup'
import PromotionBox from '../Popup/PromotionBox/PromotionBox'
import GameEnds from '../Popup/GameEnds/GameEnds'
import './Board.css'
import Files from './bites/Files'
import Ranks from './bites/Ranks'


const Board = () =>{

    const ranks = Array(8).fill().map((x,i) => 8-i)
    const files = Array(8).fill().map((x,i) => i+1)

    const {providerState} = useAppContext();
    const position = providerState.appState.position[providerState.appState.position.length -1];

    const isChecked = (() => {
        const isInCheck =  (isPlayerInCheck({
            positionAfterMove : position,
            player : providerState.appState.turn
        }))

        if (isInCheck)
            return getKingposition (position, providerState.appState.turn)

        return null
    })()

    const getClassName = (i,j) =>{
        let c ='tile'
        c+= (i+j)%2 === 0 ? ' tile--dark ' : ' tile--light '

        if (providerState.appState.candidateMoves?.find(m => m[0] === i && m[1] === j)){
            if (position[i][j])
                c+= ' attacking'
            else 
                c+= ' highlight'
        }

        if (isChecked && isChecked[0] === i && isChecked[1] === j)
            c+= "checked"
        return c
    }

    return <div className='board'>
        <Ranks ranks={ranks}/>
        <div className="tiles">
           {ranks.map((rank,i)=>
        files.map((file,j)=>
            <div key={file+'-'+rank}
             className={getClassName(7-i,j)}></div>
           )
        
        )}
        </div>

        <Pieces/>

        <Popup>
            <PromotionBox/>
            <GameEnds/>
            </Popup>

        <Files files={files} />
    </div>
}

export default Board