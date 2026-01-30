// app/(seller)/seller-dashboard/medicines/create/page.tsx

import { CreateMedicineFormClient } from "@/components/layouts/seller/CreateMedicineFormClient";
import { userService } from "@/services/user/user.service";
import { redirect } from "next/navigation";

const CreateMedicine = async () => {
  const { data } = await userService.getSession();

  if (!data?.user) {
    redirect("/login");
  }

  const sellerId = data.user.id; 

  return (
    <div className="p-6">
      <CreateMedicineFormClient sellerId={sellerId} />
    </div>
  );
};

export default CreateMedicine;
;