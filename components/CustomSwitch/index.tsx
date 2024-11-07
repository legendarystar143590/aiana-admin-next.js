import * as React from "react"

export default function CustomizedSwitches({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <label
        className="inline-block text-[#767676] hover:cursor-pointer"
        htmlFor="flexSwitchCheckDefault"
        >Inactive</label>
      <input
        className="text-black h-6 w-10 appearance-none rounded-full bg-white before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:mt-[0.06rem] after:ml-[0.15rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-[#767676] after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-none checked:after:absolute checked:after:bg-white checked:after:z-[2] checked:after:mt-[0.06rem] checked:after:ml-[1.05rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.01] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
        type="checkbox"
        role="switch"
        checked={value}
        value={value}
        onChange={onChange}
        id="flexSwitchCheckDefault" />
      <label
        className="inline-block text-black pl-[0.15rem] hover:cursor-pointer"
        htmlFor="flexSwitchCheckDefault"
      >Active</label>
    </div>
  )
}
