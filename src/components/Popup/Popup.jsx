import React from 'react';
import { Status } from '../../constant';
import { useAppContext } from '../../context/Context'
import { closePopup } from '../../reducer/actions/popup';
import './Popup.css'


const Popup = ({children}) =>{
    const {providerState} = useAppContext();

    if(providerState.appState.status === Status.ongoing)
        return null

    const onClosePopup = () =>{
        providerState.dispatch(closePopup)
    }
    return <div className='popup'>
       {React.Children
        .toArray(children)
        .map(child => React.cloneElement(child, {onClosePopup}))
       
       }
    </div>

}

export default Popup