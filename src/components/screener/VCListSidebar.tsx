
import React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";

export type VC = {
  id: string;
  name: string;
};

type VCListSidebarProps = {
  vcs: VC[];
  selectedVCId: string | null;
  onSelectVC: (vcId: string) => void;
};

const VCListSidebar: React.FC<VCListSidebarProps> = ({ vcs, selectedVCId, onSelectVC }) => {
  return (
    <Sidebar className="w-60 bg-black/90 text-white border-r border-gray-800" collapsible>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Top VC Firms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {vcs.map((vc) => (
                <SidebarMenuItem key={vc.id}>
                  <SidebarMenuButton
                    isActive={selectedVCId === vc.id}
                    onClick={() => onSelectVC(vc.id)}
                    className="flex items-center space-x-2"
                  >
                    <Wallet className="mr-2 w-4 h-4 text-yellow-400" />
                    <span>{vc.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default VCListSidebar;
