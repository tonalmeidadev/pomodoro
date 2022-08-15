interface ButtonProps {
  onClick: () => void
  className: string
  text: string
}

export function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`flex justify-center m-auto w-full text-lg px-4 py-2 rounded transition-colors ${props.className}`}
    >
      {props.text}
    </button>
  )
}