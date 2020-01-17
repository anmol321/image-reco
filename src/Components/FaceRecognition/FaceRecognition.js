import React from 'react';
import './FaceRecognition.css';
      
const FaceRecognition = ({imageUrl, box}) =>{
    if(box!==undefined){
        return (
            <div className="center ma">
            <div className='absolute mt2'>
                <img src={imageUrl} alt="Face Reco." width="500px" height="auto" id='inputimage'/>
                <div className='boundingBox' style={{top:box.leftCol,right:box.topRow,bottom:box.rightCol,left:box.bottomRow}}></div>
            </div>
            </div>
        );  
    }
}

export default FaceRecognition;