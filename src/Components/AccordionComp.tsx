import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import white from "../assets/images/white.png";
import danger from "../assets/images/danger.png";
import doneChecklist from "../assets/images/doneChecklist.png";
import addChecklist from "../assets/images/addChecklist.png";
import CI from "../assets/images/CI.png";
import noneChecklist from "../assets/images/noneChecklist.png";
import whiteDot from "../assets/images/whiteDot.png";
import redDot from "../assets/images/redDot.png";
import blueDot from "../assets/images/blueDot.png";
import greenDot from "../assets/images/greenDot.png";
import AddNewItemModal from "../modals/Modal";
import { createDatabaseOwn, getTasksCollection } from "../db/db";
import editIcon from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/delete.svg";
import ConfirmationModal from "../modals/ConfirmationModal";

function AccordionComp() {
  const [checkList, setCheckList] = useState("checkList1");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [tasks, setTasks] = useState([]);
  const [newItemDataLatest, setNewItemDataLatest] = useState("");
  const [titleToProp, setTitleToProp] = useState("");
  const [isModalClosed, setIsModalClosed] = useState(true);
  const [isUpdateDescription, setIsUpdateDescription] = useState(false);
  const [toGetTitle, setToGetTitle] = useState("");
  const [totalCheckList1, setTotalCheckList1] = useState(0);
  const [totalSecondChecklist, setTotalSecondChecklist] = useState(0);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  useEffect(() => {
    // Fetch data from RxDB when the component mounts
    fetchData();
  }, [isModalClosed]);

  // Fetch data from RxDB when the component mounts
  const fetchData = async () => {
    try {
      const db = await createDatabaseOwn();
      const tasksCollection = await getTasksCollection(db);
      const allTasks = await tasksCollection.find().exec();
      setTasks(allTasks);
      // Calculate the count for checkList1
      const checkList1Items = allTasks.filter((items: any) => {
        return items?._data?.checkList === "checkList1";
      });
      // Calculate the count for secondChecklist
      const secondChecklistItems = allTasks.filter((items: any) => {
        return items?._data?.checkList === "secondChecklist";
      });
      // Set the counts
      setTotalCheckList1(checkList1Items.length);
      setTotalSecondChecklist(secondChecklistItems.length);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // In CheckListsComp component when updating description
  const openModalToUpdateDescription = (description: any) => {
    // Set the description in the newItemDataLatest state
    setNewItemDataLatest(description);

    setIsModalOpen(true);
    setIsUpdateDescription(true); // Set the modal to update description mode
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateDescription(false);
    setNewItemDataLatest("");
  };

  // Function to handle saving a new item
  const handleSaveNewItem = async (newItemData: any) => {
    if (isUpdateDescription) {
      try {
        const db = await createDatabaseOwn();
        const tasks = await getTasksCollection(db);
        const item = await tasks.find({
          selector: {
            title: titleToProp,
          },
        });
        await item.update({
          $set: {
            description: newItemData.description.trim(),
          },
        });
        setIsModalOpen(false);
        setIsModalClosed(!isModalClosed);
      } catch (error) {
        console.error("Error changing status:", error);
      }
    } else {
      try {
        const db = await createDatabaseOwn();
        const tasks = await getTasksCollection(db);
        // Create a new document with title and description
        const newItem = await tasks?.insert({
          title: newItemData.task.trim(),
          description: newItemData.description.trim(),
          status: newItemData.status,
          checkList: checkList,
          createdAt: Date.now(),
          completed: false, // You can set other properties as needed
        });
        setIsModalOpen(false);
        setIsModalClosed(!isModalClosed);
      } catch (error) {
        console.error("Error saving item:", error);
      }
    }
    setIsUpdateDescription(false);
  };

  //function to change status
  const changeStatus = async (status: any, result: any) => {
    setToGetTitle(status);
    try {
      const db = await createDatabaseOwn();
      const tasks = await getTasksCollection(db);
      const item = await tasks.find({
        selector: {
          title: status,
        },
      });

      await item.update({
        $set: {
          status: result.trim(),
        },
      });
      // Trigger the useEffect to fetch updated data
      setIsModalClosed(!isModalClosed);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  // function to open delete confirmation
  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  // function to close delete confirmation
  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
  };

  // function to delete an item
  const handleDeleteEntry = async () => {
    try {
      const db = await createDatabaseOwn();
      const tasks = await getTasksCollection(db);
      const item = await tasks.find({
        selector: {
          title: titleToProp,
        },
      });
      if (item) {
        await item.remove();
      }
      setIsDeleteConfirmationOpen(false);
      setIsModalClosed(!isModalClosed);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  return (
    <div>
      <Accordion className="w-full" allowToggle>
        <AccordionItem className="border-b border-gray-200 py-[17px] dark:!border-white/10">
          <h2>
            <AccordionButton className="flex justify-between">
              <div
                onClick={() => {
                  setCheckList("checkList1");
                }}
                className="flex-1 text-left"
              >
                <span className="font-bold text-navy-900 dark:text-white ml-4 ">
                  CheckList 1
                </span>
              </div>
              <AccordionIcon className="text-left !text-navy-900 dark:!text-white mr-4" />
            </AccordionButton>
          </h2>
          <AccordionPanel
            className="text-left text-medium mt-2 !text-navy-900 dark:!text-white"
            pb={4}
          >
            <div className="py-1 border h-12 flex items-center ">
              <img src={CI} alt="CI-logo" className=" ml-3" />
              <div className=" flex items-center ml-3 w-3/4">
                <h5> Light Bulb 150S</h5>
              </div>

              <p className="text-end  w-1/4 mr-4 text-[.7rem] text-slate-400">
                {totalCheckList1} STEPS
              </p>
            </div>
            <ul>
              {tasks.map((items: any, index: any) => {
                if (items?._data?.checkList === checkList) {
                  return (
                    <li key={index} className=" flex items-center">
                      <img
                        onClick={async () => {
                          let result =
                            items?._data?.status === "notStarted"
                              ? "Started"
                              : items?._data?.status === "Started"
                              ? "Done"
                              : items?._data?.status === "Done"
                              ? "Blocked"
                              : "notStarted";
                          await changeStatus(items?._data?.title, result);
                        }}
                        src={
                          items?._data?.status === "notStarted"
                            ? `${white}`
                            : items?._data?.status === "Started"
                            ? `${noneChecklist}`
                            : items?._data?.status === "Done"
                            ? `${doneChecklist}`
                            : items?._data?.status === "Blocked"
                            ? `${danger}`
                            : ""
                        }
                        alt="white-logo"
                        className=" ml-3 cursor-pointer"
                      />
                      <div className=" ml-4">
                        <h5>{items?._data?.title}</h5>
                        <div className="flex items-center">
                          <img
                            src={
                              items?._data?.status === "notStarted"
                                ? `${whiteDot}`
                                : items?._data?.status === "Started"
                                ? `${blueDot}`
                                : items?._data?.status === "Done"
                                ? `${greenDot}`
                                : items?._data?.status === "Blocked"
                                ? `${redDot}`
                                : ""
                            }
                            alt="whiteDot-logo"
                            className="h-3 w-3"
                          />
                          <p className="ml-2 text-[.7rem] text-slate-400 w-80">
                            {items?._data?.status === "notStarted"
                              ? items?._data?.description
                                ? `Not Started : ${items?._data?.description}`
                                : "Not Started"
                              : items?._data?.status === "Started"
                              ? items?._data?.description
                                ? `Started : ${items?._data?.description}`
                                : "Started"
                              : items?._data?.status === "Done"
                              ? items?._data?.description
                                ? `Done : ${items?._data?.description}`
                                : "Done"
                              : items?._data?.status === "Blocked"
                              ? items?._data?.description
                                ? `Blocked : ${items?._data?.description}`
                                : "Blocked"
                              : ""}
                          </p>
                        </div>
                        <span className="flex mt-1">
                          <button
                            onClick={() => {
                              openModal(); // Call openModal to open the modal
                              openModalToUpdateDescription(
                                items?._data?.description
                              );
                              setTitleToProp(items?._data?.title);
                            }}
                            className="flex text-white bg-blue-500 rounded h-6 w-16  items-center justify-around"
                          >
                            <span> Edit </span>
                            <img
                              src={editIcon}
                              alt="edit icon"
                              className="h-4 w-4"
                            />{" "}
                          </button>
                          <button
                            onClick={() => {
                              openDeleteConfirmationModal();
                              setTitleToProp(items?._data?.title);
                            }}
                            className="flex text-white bg-red-600 rounded h-6 w-20  items-center justify-around ml-2"
                          >
                            Delete{" "}
                            <img
                              src={deleteIcon}
                              alt="edit icon"
                              className="h-4 w-4"
                            />{" "}
                          </button>
                        </span>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </AccordionPanel>
        </AccordionItem>{" "}
        <AccordionItem className="border-b border-gray-200 py-[17px] dark:!border-white/10">
          <h2>
            <AccordionButton className="flex justify-between">
              <div
                className="flex-1 text-left "
                onClick={() => {
                  setCheckList("secondChecklist");
                }}
              >
                <span className="font-bold text-navy-900 dark:text-white ml-4">
                  CheckList 2
                </span>
              </div>
              <AccordionIcon className="text-left !text-navy-900 dark:!text-white mr-4" />
            </AccordionButton>
          </h2>
          <AccordionPanel
            className="text-medium mt-2 text-left !text-navy-900 dark:!text-white"
            pb={4}
          >
            <div className="py-1 border h-12 flex items-center ">
              <img src={CI} alt="CI-logo" className=" ml-3" />
              <div className=" flex items-center ml-3 w-3/4">
                <h5> Light Bulb 150S</h5>
              </div>

              <p className="text-end  w-1/4 mr-4 text-[.7rem] text-slate-400">
                {totalSecondChecklist} STEPS
              </p>
            </div>
            <ul>
              {tasks.map((items: any, index: any) => {
                if (items?._data?.checkList === checkList) {
                  return (
                    <li key={index} className=" flex items-center">
                      <img
                        onClick={async () => {
                          let result =
                            items?._data?.status === "notStarted"
                              ? "Started"
                              : items?._data?.status === "Started"
                              ? "Done"
                              : items?._data?.status === "Done"
                              ? "Blocked"
                              : "notStarted";
                          await changeStatus(items?._data?.title, result);
                        }}
                        src={
                          items?._data?.status === "notStarted"
                            ? `${white}`
                            : items?._data?.status === "Started"
                            ? `${noneChecklist}`
                            : items?._data?.status === "Done"
                            ? `${doneChecklist}`
                            : items?._data?.status === "Blocked"
                            ? `${danger}`
                            : ""
                        }
                        alt="white-logo"
                        className=" ml-3 cursor-pointer"
                      />
                      <div className=" ml-4">
                        <h5>{items?._data?.title}</h5>
                        <div className="flex items-center">
                          <img
                            src={
                              items?._data?.status === "notStarted"
                                ? `${whiteDot}`
                                : items?._data?.status === "Started"
                                ? `${blueDot}`
                                : items?._data?.status === "Done"
                                ? `${greenDot}`
                                : items?._data?.status === "Blocked"
                                ? `${redDot}`
                                : ""
                            }
                            alt="whiteDot-logo"
                            className="h-3 w-3"
                          />
                          <p className="ml-2 text-[.7rem] text-slate-400 w-full pr-4">
                            {items?._data?.status === "notStarted"
                              ? items?._data?.description
                                ? `Not Started : ${items?._data?.description}`
                                : "Not Started"
                              : items?._data?.status === "Started"
                              ? items?._data?.description
                                ? `Started : ${items?._data?.description}`
                                : "Started"
                              : items?._data?.status === "Done"
                              ? items?._data?.description
                                ? `Done : ${items?._data?.description}`
                                : "Done"
                              : items?._data?.status === "Blocked"
                              ? items?._data?.description
                                ? `Blocked : ${items?._data?.description}`
                                : "Blocked"
                              : ""}
                          </p>
                        </div>
                        <span className="flex mt-1">
                          {" "}
                          <button
                            onClick={() => {
                              openModal(); // Call openModal to open the modal
                              openModalToUpdateDescription(
                                items?._data?.description
                              );
                              setTitleToProp(items?._data?.title);
                            }}
                            className="flex text-white bg-blue-500 rounded h-6 w-16  items-center justify-around"
                          >
                            Edit{" "}
                            <img
                              src={editIcon}
                              alt="edit icon"
                              className="h-4 w-4"
                            />{" "}
                          </button>
                          <button
                            onClick={() => {
                              openDeleteConfirmationModal();
                              setTitleToProp(items?._data?.title);
                            }}
                            className="flex text-white bg-red-600 rounded h-6 w-20  items-center justify-around ml-2"
                          >
                            Delete{" "}
                            <img
                              src={deleteIcon}
                              alt="edit icon"
                              className="h-4 w-4"
                            />{" "}
                          </button>
                        </span>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <div
        onClick={openModal}
        className="py-1 flex items-center cursor-pointer"
      >
        <img src={addChecklist} alt="addChecklist-logo" className=" ml-3" />
        <div className=" ml-4">
          <h5 className="text-[#2b87e3]  font-medium ">ADD NEW ITEM</h5>
        </div>
      </div>
      {/* Modal component */}
      {isModalOpen ? (
        <AddNewItemModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveNewItem}
          openModal={openModal}
          isUpdateDescription={isUpdateDescription}
          newItemDataLatest={newItemDataLatest}
          title={titleToProp}
        />
      ) : (
        ""
      )}
      {isDeleteConfirmationOpen && (
        <ConfirmationModal
          onConfirm={handleDeleteEntry}
          onCancel={closeDeleteConfirmationModal}
        />
      )}
    </div>
  );
}

export default AccordionComp;
