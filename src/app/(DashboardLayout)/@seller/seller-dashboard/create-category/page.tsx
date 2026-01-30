import { CreateCategoryFormClient } from '@/components/layouts/seller/createCategoryFormClient';
import React from 'react';

const createCategory = () => {
    return (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
       <CreateCategoryFormClient/>
    </div>
    );
};

export default createCategory;