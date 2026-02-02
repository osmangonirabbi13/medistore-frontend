import { SectionCards } from '@/components/layouts/SectionCards';
export const dynamic = "force-dynamic";
export const revalidate = 0;

const AdminPage = async () => {

  return (
    <div>
      <SectionCards/>
    </div>
  );
};

export default AdminPage;