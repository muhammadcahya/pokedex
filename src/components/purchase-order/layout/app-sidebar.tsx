import * as React from 'react'
import {
  FileTextIcon,
  HeartIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  ReceiptIcon,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navMain = [
  {
    title: 'Home',
    url: '/',
    icon: HouseIcon,
  },
  {
    title: 'Search',
    url: '/search',
    icon: MagnifyingGlassIcon,
  },
  {
    title: 'Favorites',
    url: '/favorites',
    icon: HeartIcon,
  },
  {
    title: 'Compare',
    url: '/compare',
    icon: FileTextIcon,
  },
]

const navPurchase = [
  {
    title: 'Purchase Order',
    url: '/purchase-order',
    icon: ReceiptIcon,
    isActive: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={(linkProps) => (
                <Link to="/" {...linkProps}>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <span className="text-lg font-bold">P</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Pokedex</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </Link>
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={(linkProps) => (
                      <Link to={item.url} {...linkProps}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Purchase</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navPurchase.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    render={(linkProps) => (
                      <Link to={item.url} {...linkProps}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <span className="text-muted-foreground text-xs">v1.0.0</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
