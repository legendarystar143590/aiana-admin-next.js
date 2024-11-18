import React from "react"

import SideNavbar from "../SideNavBar"
import AccountManagementDropdown from "../AccountDropMenu"
import { ILayout } from "./types"
import BreadCrumbs from "../BreadCrumbs"

const AdminLayout = ({ children }: ILayout) => (
  <div className="flex">
    <SideNavbar />
    <div className="w-screen h-screen p-5 bg-gray-100 min-w-[485px]">
      <div className="flex flex-col h-full bg-white border rounded-3xl">
        <div className="h-[85px] flex justify-between items-center py-5 px-10 bg-white rounded-t-3xl">
          <BreadCrumbs/>
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
