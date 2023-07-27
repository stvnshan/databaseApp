import React from "react";

const CardTitleSplit = ({name, id}) => {
  return (
    <div className='card-title-split'>
      <h5>{name}</h5>
      <h5 className='card-title-id'>ID: {id}</h5>
    </div>
  );
}

export { CardTitleSplit };
