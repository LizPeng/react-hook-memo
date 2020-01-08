import React, { useRef } from 'react'

/**
 * const refContainer = useRef(initialValue)
 * useRef returns a mutable ref object 
 * whose .current property is initialized to the passed argument(inittialValue)
 * The returned object will persist for the full lifetime of the component
 */

function TextInputWithFocusButton() {
  const inputEL = useRef(null);
  const onButtonClick = () => {
    console.log(inputEL); // input
    // `current` points to the mounted text input element
    inputEL.current.focus();
  }
  console.log(inputEL); // null
  return (
    <>
      <input ref={inputEL} type="text"/>
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  )
}

export default TextInputWithFocusButton;