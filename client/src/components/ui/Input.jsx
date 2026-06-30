

const defaultStyle = "rounded-md px-3 py-2 mt-2 hover:bg-gray-300 w-full duration:200 transition-all"

export const Input = (props)=>{
   
    return <input ref={props.ref} placeholder={props.placeholder} type = {props.type || "text"} className={`${props.className} ${defaultStyle}`}></input>
}