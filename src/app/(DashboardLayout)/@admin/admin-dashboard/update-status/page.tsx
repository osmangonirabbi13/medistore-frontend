import { getAllUsers } from "@/actions/admin.action";
import UsersClient from "@/components/layouts/UsersClient";


export default async function Page() {
  const res = await getAllUsers(); 
  const users = res?.data ?? [];

  return <UsersClient initialUsers={users} />;
}
