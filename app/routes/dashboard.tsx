import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import {
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  TicketIcon,
} from "@heroicons/react/20/solid";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";

import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "~/components/ui/dropdown";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "~/components/ui/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "~/components/ui/sidebar";
import { SidebarLayout } from "~/components/ui/sidebar-layout";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export default function Dashboard() {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <UserIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <SidebarLabel>RMI</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
            </Dropdown>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/search">
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard">
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/dashboard/tickets">
                <TicketIcon />
                <SidebarLabel>Tickets</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <Form action="/logout" method="POST" className="flex">
                  <button type="submit" className="w-full">
                    <DropdownItem className="flex gap-4 text-nowrap w-full justify-between">
                      <ArrowRightStartOnRectangleIcon />
                      <DropdownLabel>Sign out</DropdownLabel>
                    </DropdownItem>
                  </button>
                </Form>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Outlet />
    </SidebarLayout>
  );
}
