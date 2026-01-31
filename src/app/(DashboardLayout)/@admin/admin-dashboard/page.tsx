import { getAdminStats, getAllOrders, getAllUsers } from '@/actions/admin.action';

const AdminPage = async () => {

  const res = await getAllUsers()

  const data = await getAdminStats()

  const getAllOrder = await getAllOrders()

  console.log("getAllOrders" , getAllOrder);

  console.log(res);
  console.log(data);
  return (
    <div>
      <h1>admin</h1>
    </div>
  );
};

export default AdminPage;