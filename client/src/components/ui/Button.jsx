import { buttonSize,textSize} from "./size"

const defaultStyle = "rounded-md flex items-center justify-center gap-2 hover:opacity-70 duration-200 transition-all"

const variant = {
    "primary":"bg-blue-600 text-white",
    "secondary":"bg-gray-200 text-black"
}

export const Button = (props)=>{
    
    return <button className={`${props.className} ${defaultStyle} ${buttonSize[props.size]} ${variant[props.variant]} ${textSize[props.textSize]} `} onClick={props.onClick} >
        {props.startinItem ? props.startingItem : null }
        {props.text}
        {props.endIcon?props.endIcon : null}
    </button>
}