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

// callback ref
// In this example, the callback ref will be called only when the component mounts and unmounts
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
export default TextInputWithFocusButton;