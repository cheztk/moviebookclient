import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import Button from "../../components/Button";
import { message, Table } from "antd";
import TheatreForm from "./TheatreForm";
import { useDispatch, useSelector } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { GetAllTheatresByOwner, DeleteTheatre } from "../../apicalls/theatres";
import Shows from "./Shows";

function TheatresList() {
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const [showTheatreFormModal, setShowTheatreFormModal] = useState(false);
  const [selectedTheatre , setSelectedTheatre] = useState(null);
  const [formType , setFormType] = useState("add");
  const [theatres , setTheatres] = useState([]);
  const [openShowsModal, setOpenShowsModal] = useState(false);

 
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatresByOwner({
        owner: user._id,
      });
      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };


  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({ theatreId: id });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text, record) => {
        if (text) {
          return "Approved";
        } else {
          return "Pending / Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setFormType("edit");
                setSelectedTheatre(record);
                setShowTheatreFormModal(true);
              }}
            ></i>

            {record.isActive && (
              <span
                className="underline"
                onClick={() => {
                  setSelectedTheatre(record);
                  setOpenShowsModal(true);
                }}
              >
                Shows
              </span>
            )}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getData();
  }, [selectedTheatre]);
  return(
    <div>
      <div className="flex justify-end mb-1">
        <Button
          variant="outlined"
          title="Add Theatre"
          onClick={() => {
            setFormType("add");
            setShowTheatreFormModal(true);
          }}
        />
      </div>

      <Table rowKey={record => record._id} columns={columns} dataSource={theatres} />

      {showTheatreFormModal && (
        <TheatreForm
          showTheatreFormModal={showTheatreFormModal}
          setShowTheatreFormModal={setShowTheatreFormModal}
          formType={formType}
          setFormType={setFormType}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
          
        />
      )}
      {openShowsModal && (
       <Shows
       openShowsModal={openShowsModal}
       setOpenShowsModal={setOpenShowsModal}
       theatre={selectedTheatre}
       />
      )}

    </div>
  )

}

export default TheatresList;