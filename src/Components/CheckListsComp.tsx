import white from "../assets/images/white.png";
import danger from "../assets/images/danger.png";
import doneChecklist from "../assets/images/doneChecklist.png";
import addChecklist from "../assets/images/addChecklist.png";
import CI from "../assets/images/CI.png";
import noneChecklist from "../assets/images/noneChecklist.png";
import whiteDot from "../assets/images/whiteDot.png";
import redDot from "../assets/images/redDot.png";
import blueDot from "../assets/images/blueDot.png";
import yellowDot from "../assets/images/yellowDot.png";
import greenDot from "../assets/images/greenDot.png";
import arrow from "../assets/images/arrow.png";
import React, { useEffect, useState } from "react";
import AddNewItemModal from "../modals/Modal";
import { createDatabaseOwn, getTasksCollection } from "../db/db";
import editIcon from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/delete.svg";
import ConfirmationModal from "../modals/ConfirmationModal";

function CheckListsComp() {
  const [checkList, setCheckList] = useState("checkList1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [tasks, setTasks] = useState([]);
  const [newItemDataLatest, setNewItemDataLatest] = useState("");
  const [titleToProp, setTitleToProp] = useState("");
  // State to track the modal's open/closed state
  const [isModalClosed, setIsModalClosed] = useState(true);
  const [isUpdateDescription, setIsUpdateDescription] = useState(false);
  const [toGetTitle, setToGetTitle] = useState("");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  // Fetch data from RxDB when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await createDatabaseOwn();
        const tasksCollection = await getTasksCollection(db);
        const allTasks = await tasksCollection.find().exec();
        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, [isModalClosed]);

  // In CheckListsComp component when updating description
  const openModalToUpdateDescription = (description: any) => {
    // Set the description in the newItemDataLatest state
    setNewItemDataLatest(description);

    setIsModalOpen(true);
    setIsUpdateDescription(true); // Set the modal to update description mode
  };

  //dropdown function
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //2nd checkList function
  const handleSecondChecklistClick = () => {
    setCheckList("secondChecklist");
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateDescription(false);
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
    <div className="border-black bg-black h-screen p-1">
      <div className="md:w-[50%] bg-[#f7f8fa] md:mx-auto mt-4">
        <div className=" w-full  border-[#e5e1e2] bg-white border-b-2 p-1">
          <h5 className=" w-full text-[#0c0d0d] font-['Roboto'] text-lg font-semibold leading-[normal] ml-4 mt-2">
            Task Name
          </h5>
          <div className="mb-2 ml-4 w-full flex  text-[#f90000] font-['Roboto'] text-xs leading-[normal]">
            <img src={redDot} alt="redDot-logo" className="h-3 w-3" />

            <span className="ml-2"> Ticket progress is blocked </span>
          </div>
        </div>

        <div className=" pb-4  border-[#e1e3e5] bg-white ">
          {/* checklist condition  */}
          <div>
            <div
              className="flex ml-4 justify-between cursor-pointer  py-2"
              onClick={toggleDropdown}
            >
              <div
                onClick={() => {
                  setCheckList("checkList1");
                }}
                className="text-[#0c0d0d] font-['Roboto'] text-lg font-semibold leading-[normal] "
              >
                <span
                  className={checkList === "checkList1" ? "text-blue-300" : ""}
                >
                  {" "}
                  Check List{" "}
                </span>
              </div>
              {checkList === "checkList1" && (
                <img
                  src={arrow}
                  alt="arrow-logo"
                  className={`h-3 w-3 mt-2 mr-8 rotate-180`}
                />
              )}
            </div>
          </div>
          <div>
            <div
              className="flex ml-4 justify-between cursor-pointer py-2"
              onClick={toggleDropdown}
            >
              <div
                onClick={() => {
                  setCheckList("secondChecklist");
                }}
                className="text-[#0c0d0d] font-['Roboto'] text-lg font-semibold leading-[normal] "
              >
                <span
                  className={
                    checkList === "secondChecklist" ? "text-blue-300" : ""
                  }
                >
                  {" "}
                  2nd Check List{" "}
                </span>
              </div>
              {checkList === "secondChecklist" && (
                <img
                  src={arrow}
                  alt="arrow-logo"
                  className={`h-3 w-3 mr-8 rotate-180`}
                />
              )}
            </div>
          </div>

          <div className="py-1 border h-12 flex items-center ">
            <img src={CI} alt="CI-logo" className=" ml-3" />
            <div className=" flex items-center ml-3 w-3/4">
              <h5> Light Bulb 150S</h5>
            </div>

            <p className="text-end  w-1/4 mr-4 text-[.7rem] text-slate-400">
              7 STEPS
            </p>
          </div>

          {/* Render items based on the current checkList */}
          {tasks.map((items: any, index) => {
            // Check if the task's checklist matches the current checkList state
            if (items?._data?.checkList === checkList) {
              return (
                <div key={index}>
                  <div className="py-1 flex items-center border">
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
                      <span className="flex cursor-pointer">
                        {" "}
                        <button
                          onClick={() => {
                            openModal(); // Call openModal to open the modal
                            openModalToUpdateDescription(
                              items?._data?.description
                            );
                            setTitleToProp(items?._data?.title);
                          }}
                          className="flex text-white bg-blue-500 rounded px-2 my-1 py-1"
                        >
                          Edit{" "}
                          <img
                            src={editIcon}
                            alt="edit icon"
                            className=" ml-2"
                          />{" "}
                        </button>
                        <button
                          onClick={() => {
                            openDeleteConfirmationModal();
                            setTitleToProp(items?._data?.title);
                          }}
                          className="flex text-white bg-red-600 rounded px-2 my-1 ml-2 py-1"
                        >
                          Delete{" "}
                          <img
                            src={deleteIcon}
                            alt="edit icon"
                            className=" ml-2"
                          />{" "}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null; // Don't render items that don't match the current checkList
            }
          })}

          {/* last to add action*/}
          <div
            onClick={openModal}
            className="py-1 flex items-center cursor-pointer"
          >
            <img src={addChecklist} alt="addChecklist-logo" className=" ml-3" />
            <div className=" ml-4">
              <h5 className="text-[#2b87e3]  font-medium ">ADD NEW ITEM</h5>
            </div>
          </div>
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
          onConfirm={
            handleDeleteEntry
          }
          onCancel={closeDeleteConfirmationModal}
        />
      )}
    </div>
  );
}
export default CheckListsComp;
