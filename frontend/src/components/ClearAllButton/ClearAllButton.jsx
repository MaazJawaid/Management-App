import React from 'react'

const ClearAllButton = ({ clearField }) => {
  const sendDataToParent = () => {
    clearField();
  };
  return (
    <div
      onClick={sendDataToParent}
      className=' d-flex justify-content-end m-3 w-auto '>
      <span className='btn btn-primary px-5 py-2 '>
        Limpar Tudo
      </span>
    </div>
  )
}

export default ClearAllButton
