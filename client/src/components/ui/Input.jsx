

const defaultStyle = "rounded-lg shadow-lg px-3 py-2  mt-3  hover:bg-gray-200 border-none text-black bg-white w-full duration:200 transition-all"

export const Input = (props)=>{
   
    return <input ref={props.ref} placeholder={props.placeholder} type = {props.type || "text"} className={`${props.className} ${defaultStyle}`}></input>
}