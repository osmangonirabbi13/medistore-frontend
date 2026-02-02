import { CreateCategoryFormClient } from '@/components/layouts/seller/createCategoryFormClient';
export const dynamic = "force-dynamic";
export const revalidate = 0;
const createCategory = () => {
    return (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
       <CreateCategoryFormClient/>
    </div>
    );
};

export default createCategory;