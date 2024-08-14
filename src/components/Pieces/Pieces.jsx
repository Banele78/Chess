import './Pieces.css'
import Piece from './Piece'
import { useState, useRef } from 'react'
import { createPosition,copyPosition,  getNewMoveNotation } from '../../helper'
import { useAppContext } from '../../context/Context'
import { clearCandidates, makeNewMove } from '../../reducer/actions/move'
import { insufficientMaterial, isCheckMate, isStalemate, performMove } from '../../arbiter/arbiter'
import { openPromotion } from '../../reducer/actions/popup'
import { detectCheckmate, detectInsufficientMaterial, detectStalemate, updateCastling } from '../../reducer/actions/game'
import { getCastlingDirections } from '../../arbiter/getMoves'

const Pieces = () =>{
  const ref = useRef()

  const {providerState} = useAppContext();

  const currentPosition = providerState.appState.position[providerState.appState.position.length-1]
  
    const calculateCoords = e =>{
      const {width,left,top}=ref.current.getBoundingClientRect()
      const size = width/8
      const y= Math.floor((e.clientX - left)/ size)
      const x= 7-Math.floor((e.clientY - top)/ size)
      console.log(x,y)
      return { x, y }
       
    }

    const updateCastlingState = ({piece,file,rank}) => {
      const direction = getCastlingDirections({
          castleDirection:providerState.appState.castleDirection,
          piece,
          file,
          rank
      })
      if (direction){
          providerState.dispatch(updateCastling(direction))
      }
  }

  
    const openPromotionBox =({rank,file,x,y}) =>
      providerState.dispatch (openPromotion({
        rank : Number(rank),
        file : Number(file),
        x,
        y
      }))

    const move = e =>{
      const {x,y} = calculateCoords(e);
    
      const  [piece,rank,file] = e.dataTransfer.getData("text").split(',')
      if (providerState.appState.candidateMoves?.find(m => m[0] === x && m[1] === y)){
        const opponent = piece.startsWith('b') ? 'w' : 'b'
        const castleDirection = providerState.appState.castleDirection[`${piece.startsWith('b') ? 'w' : 'b'}`]

        if ((piece === "wp" && x === 7) || (piece === "bp" && x ===0)){
          openPromotionBox({rank,file,x,y})
           return 
        }
        if (piece.endsWith('r') || piece.endsWith('k')){
          updateCastlingState({piece, rank, file})
        }
        const newPosition = performMove({
          position : currentPosition,
          piece, rank, file,
          x,y
        })

        const newMove = getNewMoveNotation ({
          piece, rank, file, x, y, position: currentPosition
        });
        console.log(newMove);



        providerState.dispatch(makeNewMove({newPosition, newMove}))

        if (insufficientMaterial(newPosition))
         providerState.dispatch(detectInsufficientMaterial())
      else if (isStalemate(newPosition,opponent,castleDirection)){
         providerState.dispatch(detectStalemate())
      }  else if (isCheckMate(newPosition,opponent,castleDirection)){
        providerState.dispatch(detectCheckmate(piece[0]))
    }
    }
      providerState.dispatch(clearCandidates())
    }

    const onDrop = e =>{
      e.preventDefault();
      move(e);
    }

    const onDragOver = e =>{e.preventDefault()}

    return  <div 
    className='pieces' 
    ref={ref} 
    onDrop={onDrop} 
    onDragOver={onDragOver} > 
    {currentPosition.map((r,rank) => 
        r.map((f,file) => 
            currentPosition[rank][file]
            ?   <Piece 
                    key={rank+'-'+file} 
                    rank = {rank}
                    file = {file}
                    piece = {currentPosition[rank][file]}
                />
            :   null
        )   
    )}
    </div>

}

export default Pieces