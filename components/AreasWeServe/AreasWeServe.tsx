'use client';
import { useGetAllServiceAreasQuery, useUpdateServiceAreaMutation } from '@/redux/features/serviceArea/serviceAreaApi';
import React, { useEffect, useState, useCallback } from 'react';
import { TbEdit } from 'react-icons/tb';
import { MdOutlineDelete } from 'react-icons/md';
import { Modal } from 'antd';
import EditAreasWeServe from './EditAreasWeServe';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import Swal from 'sweetalert2';

type Route = {
    _id?: string;
    code: string;
    name: string;
};

type RouteList = {
    _id?: string;
    name: string;
    routes: Route[];
};

type RouteSection = {
    _id?: string;
    section: string;
    list: RouteList[];
};

const AreasWeServe = () => {
    const { data: getAllServiceAreasQuery } = useGetAllServiceAreasQuery(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSectionForEdit, setSelectedSectionForEdit] = useState<RouteList | null>(null);
    const [selectedItemForEdit, setSelectedItemForEdit] = useState<RouteList | null>(null);
    const [notSelectedItemForEdit, setNotSelectedItemForEdit] = useState<RouteList | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>('');
    const [selectedItemId, setSelectedItemId] = useState<string | undefined>('');
    const [updateServiceAreaMutation] = useUpdateServiceAreaMutation();

    // Optimized item selection logic
    const handleSelectedItem = useCallback(
        (sectionId: string | undefined, itemId: string | undefined) => {
            console.log(sectionId, itemId);
            if (sectionId && itemId) {
                const section = getAllServiceAreasQuery?.data?.find((section: any) => section._id == sectionId);
                setSelectedSectionForEdit(section);
                if (section) {
                    const selectedItem = section.list.find((item: any) => item._id === itemId);
                    const notSelectedItem = section.list.filter((item: any) => item._id !== itemId);
                    setSelectedItemForEdit(selectedItem || null);
                    setNotSelectedItemForEdit(notSelectedItem || null);
                }
            }
            setSelectedSectionId(sectionId);
            setSelectedItemId(itemId);
        },
        [getAllServiceAreasQuery]
    );

    const handleNewList = async (sectionId: any) => {
        if (sectionId) {
            const selectedSection = getAllServiceAreasQuery?.data?.find((section: any) => section._id == sectionId);

            console.log({ selectedSection });
            try {
                const res = await handleAsyncWithToast(
                    async () => {
                        // Replace this with your actual mutation or API call
                        return updateServiceAreaMutation({
                            id: sectionId,
                            data: {
                                list: [
                                    ...selectedSection?.list,
                                    {
                                        name: ' Demo',
                                        routes: [{ code: ' ', name: 'title' }],
                                    },
                                ],
                            },
                        }); // Or your custom mutation to handle form data
                    },
                    'Updating...',
                    'Update successful!',
                    'Update failed. Please try again.'
                );

                // Check if submission was successful
                if (res?.data?.success) {
                    // reset();
                    // setContent('');
                    // router.push('/blog');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    const handleDelete = useCallback(
        async (sectionId: string | undefined, itemId: string | undefined) => {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (sectionId && itemId) {
                        const section = getAllServiceAreasQuery?.data?.find((section: any) => section._id === sectionId);
                        if (section) {
                            // Filter out the item that should be deleted
                            const notSelectedItem = section.list.filter((item: any) => item._id !== itemId);
    
                            try {
                                const res = await handleAsyncWithToast(
                                    async () => {
                                        return updateServiceAreaMutation({
                                            id: sectionId,
                                            data: {
                                                list: notSelectedItem, 
                                            },
                                        });
                                    },
                                    'Updating...',
                                    'Update successful!',
                                    'Update failed. Please try again.'
                                );
    
                                // Check if submission was successful
                                if (res?.data?.success) {
                                    Swal.fire({
                                        title: 'Deleted!',
                                        text: 'Your file has been deleted.',
                                        icon: 'success',
                                        showConfirmButton: false,     
                                        timer: 1500,
                                    });
                                }
                            } catch (error) {
                                console.error('Error deleting item:', error);
                            }
                        }
                    }
                }
            });
        },
        [getAllServiceAreasQuery, updateServiceAreaMutation]
    );
    
    return (
        <div>
            <Modal title="Edit Areas" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <EditAreasWeServe selectedItemForEdit={selectedItemForEdit} notSelectedItemForEdit={notSelectedItemForEdit} selectedSectionId={selectedSectionId} setIsModalOpen={setIsModalOpen} />
            </Modal>

                <h3 className="text-center text-xl font-bold mb-10">Areas we serve</h3>
         

            <div className={`xs:grid-cols-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`}>
                {getAllServiceAreasQuery?.data?.map((section: RouteSection) => (
                    <div key={section?._id}>
                        {section?.list?.map((item) => (
                            <div key={item?._id} className="mb-12">
                                <div className="flex items-center gap-8">
                                    <p className=" font-bold">{item?.name}</p>

                                    <div className="flex items-center gap-2">
                                        <TbEdit
                                            size={22}
                                            onClick={() => {
                                                {
                                                    setIsModalOpen(true);
                                                    handleSelectedItem(section._id, item?._id);
                                                }
                                            }}
                                            className="cursor-pointer hover:text-blue-400"
                                        />

                                        <MdOutlineDelete onClick={() => handleDelete(section._id, item?._id)} size={22} className="cursor-pointer hover:text-red-500" />
                                    </div>
                                </div>
                                {item?.routes?.map((route) => (
                                    <p key={route?._id} className="text-green-primary my-2">
                                        {route?.code} {route?.name}
                                    </p>
                                ))}
                            </div>
                        ))}
                        <button onClick={() => handleNewList(section._id)} className="rounded bg-green-500 px-3 py-2 text-white">
                            Add List
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AreasWeServe;
