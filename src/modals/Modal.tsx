import { Fragment, useState } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";

interface AddNewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newItemData: {
    task: string;
    description: string;
    status: string;
  }) => void;
}

const AddNewItemModal: React.FC<AddNewItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [newItemData, setNewItemData] = useState({
    task: "",
    description: "",
    status: "notStarted",
  });

  const handleSaveClick = () => {
    onSave(newItemData);
    setNewItemData({ task: "", description: "", status: "" }); // Clear the input fields
    onClose(); // Close the modal
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className={`modal relative z-10${isOpen ? "open" : ""}`}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Add New Task
                    </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        <div>
                          <label
                            htmlFor="task"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Task
                          </label>
                          <div className="mt-1">
                            <input
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-blue-900 rounded-md h-8 pl-4"
                              type="text"
                              value={newItemData.task}
                              onChange={(e) =>
                                setNewItemData({
                                  ...newItemData,
                                  task: e.target.value,
                                })
                              }
                              placeholder="Enter Task Here..."
                              name="task"
                              id="task"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <div className="mt-1">
                            <input
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-blue-900 rounded-md h-8 pl-4"
                              type="text"
                              value={newItemData.description}
                              onChange={(e) =>
                                setNewItemData({
                                  ...newItemData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Enter Description Here..."
                              name="description"
                              id="description"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 mt-3 w-full inline-flex justify-center rounded-md px-4 py-2 text-white text-base font-medium  shadow-sm hover:bg-red-400  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default AddNewItemModal;
