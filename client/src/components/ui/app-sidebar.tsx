import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Avatar from 'react-avatar'
import logo from '../../assets/logo.png' 
import CreateEventForm from "../CreateEventForm"
import { useSelector } from "react-redux"
import { UserState } from "@/store/userSlice"

interface uState{
  user : UserState
}

export function AppSidebar() {
  const user = useSelector((state: uState) => state.user?.user)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2 flex items-center space-x-5">
          <img src={logo} width={70} alt="Logo" />
          <p className="text-2xl font-bold tracking-wide">Plan It</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <CreateEventForm />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 flex items-center space-x-4">
          {user ? (
            <>
              <Avatar name={user.name} size="35" className="rounded-full" />
              <p className="font-bold text-md tracking-wide">{user.name}</p>
            </>
          ) : (
            <p className="text-md italic">Guest</p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
