import React from "react"

import SideNavbar from "../SideNavBar"
import AccountManagementDropdown from "../AccountDropMenu"
import { ILayout } from "./types"
// import BreadCrumbs from "../BreadCrumbs"

const AdminLayout = ({ children }: ILayout) => (
  <div className="flex">
    <SideNavbar />
    <div className="w-screen h-screen p-5">
      <div className="flex flex-col h-full border rounded-3xl">
        <div className="h-[85px] flex justify-end items-center py-5 px-10 bg-white rounded-t-3xl">
          {/* <BreadCrumbs/> */}
          <AccountManagementDropdown />
        </div>
        <hr/>
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default AdminLayout
