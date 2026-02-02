import { getAllUsers } from "@/actions/admin.action";
import UsersClient from "@/components/layouts/UsersClient";
export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function Page() {
  const res = await getAllUsers(); 
  const users = res?.data ?? [];

  return <UsersClient initialUsers={users} />;
}
