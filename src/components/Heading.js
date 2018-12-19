import React from 'react';

const Heading = (props) => {
    const {showModal} = props;
    const titleList = props.titleList.length ? props.titleList.map((title, index) => {
        return (
            <div key={title.title+index} className={title.valid ? 'green' : 'red'} id="menu-item" >
                {title.input || 'Edit Item Title'} <sub>{title.input.length}</sub>
            </div>
        )
    }) : null
    return (
        <div className="heading">
            <div className="menu">
                {titleList}
            </div>
            {
                props.titleList.reduce((acc, next) => next.valid ? acc +=1 : acc, 0) >= 4 &&
                <button className="check" onClick={() => showModal()}>Check Infos</button>                
            }            
        </div>
    )
}

export default Heading;