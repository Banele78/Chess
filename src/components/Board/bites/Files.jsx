import { getCharacter } from '../../../helper'
import './Files.css'
const Files = ({files}) => 
    <div className="files">
        {files.map(file => <span key={file}>{getCharacter(file)}</span>)}
    </div>

export default Files