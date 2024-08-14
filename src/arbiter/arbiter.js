// arbiter.js
import { areSameColorTiles, findPieceCoords } from '../helper';
import { getBishopMoves, getKingMoves, getKnightMoves, getPawnCaptures, getPawnMoves, getQueenMoves, getRockMoves, getCastlingMoves, getKingposition, getPieces } from './getMoves';
import { movePawn, movePiece } from './move';

export const getRegularMoves = ({ position, piece, rank, file }) => {
   if (piece.endsWith('n'))
    return getKnightMoves(position, rank, file)
   if (piece.endsWith('b'))
    return getBishopMoves(position, piece, rank, file);
   if (piece.endsWith('r'))
    return getRockMoves(position, piece, rank, file);
   if (piece.endsWith('q'))
    return getQueenMoves(position, piece, rank, file);
   if (piece.endsWith('k'))
    return getKingMoves(position, piece, rank, file);
   if (piece.endsWith('p'))
    return getPawnMoves(position, piece, rank, file);    
};

export const  getValidMoves = ({position,castleDirection, prevPosition, piece, rank, file}) => {
    let moves = getRegularMoves({position, piece, rank, file});
    const notInCheckMoves = [];
    if (piece.endsWith('p')){
        moves = [
            ...moves,
            ...getPawnCaptures({position,prevPosition,piece,rank,file})
        ]
    }

    if (piece.endsWith('k')){
        moves = [
            ...moves,
            ...getCastlingMoves(position,castleDirection,piece,rank,file)
        ]
    }

    moves.forEach(([x,y]) =>{
        const positionAfterMove = performMove({position, piece, rank, file,x,y})

        if (!isPlayerInCheck({positionAfterMove, position, player : piece[0]})){
            notInCheckMoves.push([x,y])
        }
    })
    return notInCheckMoves
    
};

export const performMove = ({position, piece, rank, file, x, y}) =>{
    if(piece.endsWith('p')){
        return movePawn ({position, piece, rank, file, x, y})
    }else{
        return movePiece ({position, piece, rank, file, x, y})
    }
}

export const isPlayerInCheck = ({positionAfterMove,position,player}) =>{
    const enemy = player.startsWith('w') ? 'b' : 'w'
    let kingPos = getKingposition(positionAfterMove,player)
    const enemyPieces = getPieces(positionAfterMove,enemy)

    const enemyMoves = enemyPieces.reduce((acc,p) => acc = [
        ...acc,
        ...(p.piece.endsWith('p')
        ?   getPawnCaptures({
                position: positionAfterMove, 
                prevPosition:  position,
                ...p
            })
        :   getRegularMoves({
                position: positionAfterMove, 
                ...p
            })
        )
    ], [])
    if (enemyMoves.some (([x,y]) => kingPos[0] === x && kingPos[1] === y))
    return true

    else
    return false
}

export const  isStalemate = (position,player,castleDirection) =>{
    const isInCheck = isPlayerInCheck({positionAfterMove: position, player})

    if (isInCheck)
        return false
        
    const pieces = getPieces(position,player)
    const moves = pieces.reduce((acc,p) => acc = [
        ...acc,
        ...(getValidMoves({
                position, 
                castleDirection, 
                ...p
            })
        )
    ], [])

    return (!isInCheck && moves.length === 0)
}

export const insufficientMaterial = (position) =>{
    const pieces = 
            position.reduce((acc,rank) => 
                acc = [
                    ...acc,
                    ...rank.filter(spot => spot)
                ],[])

        // King vs. king
        if (pieces.length === 2)
            return true

        // King and bishop vs. king
        // King and knight vs. king
        if (pieces.length === 3 && pieces.some(p => p.endsWith('b') || p.endsWith('n')))
            return true

        // King and bishop vs. king and bishop of the same color as the opponent's bishop
        if (pieces.length === 4 && 
            pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
            new Set(pieces).size === 4 &&
            areSameColorTiles(
                findPieceCoords(position,'wb')[0],
                findPieceCoords(position,'bb')[0]
            )
        )
            return true

        return false
}

export const isCheckMate = (position, player, castleDirection) =>{
    const isInCheck = isPlayerInCheck({positionAfterMove: position, player})

    if (!isInCheck)
        return false
        
    const pieces = getPieces(position,player)
    const moves = pieces.reduce((acc,p) => acc = [
        ...acc,
        ...(getValidMoves({
                position, 
                castleDirection, 
                ...p
            })
        )
    ], [])

    return (isInCheck && moves.length === 0)

}
