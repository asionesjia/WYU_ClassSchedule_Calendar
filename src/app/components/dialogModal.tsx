import React, {Dispatch, Fragment, SetStateAction} from "react";
import {Dialog, Transition} from "@headlessui/react";


interface DialogModalProps {
    children: React.ReactNode;
    isOpen: boolean |undefined
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    confirmCallback: () => void;
    cancelCallback: () => void
}
export const DialogModal: React.FC<DialogModalProps> = ({cancelCallback, confirmCallback, isOpen,setIsOpen, children}) => {

    function confirmModal() {
        confirmCallback();
    }

    function cancelModal() {
        cancelCallback();
    }
    function closeModal() {
        setIsOpen(false)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="absolute z-10 w-full h-screen" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex w-full h-full items-center justify-center p-8 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="max-w-6xl transform overflow-auto rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all dark:bg-neutral-900">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                                >
                                    预览课程表
                                </Dialog.Title>
                                <div className="mt-2 h-64 touch-auto md:h-full overflow-auto">
                                    {children}
                                </div>

                                <div className="flex justify-end items-end mt-8 space-x-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        onClick={confirmModal}
                                    >
                                        确定
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        onClick={cancelModal}
                                    >
                                        取消
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
