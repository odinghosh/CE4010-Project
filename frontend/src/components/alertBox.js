import React from 'react'
import './alertBox.css'

export default function (props) {
    return ((props.trigger)?(<div>
        <div className='background'>
            </div>
        <div className="outerBox">
           
                <p> {props.children}</p>
                <button className='close' onClick={props.onClickFunction}>
                    ok 
                </button>
            </div>
            </div>
            
       
    ):""
    )

}