
import { Modal, Table, Form, Row, Col, message, Select, Input, DatePicker, TimePicker, InputNumber, Space} from "antd";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import moment from 'moment';
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../../redux/loadersSlice";
import {GetAllMovies} from '../../../apicalls/movies';
import { GetAllShowsByTheatre, AddShow, DeleteShow } from "../../../apicalls/theatres";

function Shows({openShowsModal, setOpenShowsModal, theatre}) {



    const [view, setView] = useState("table");
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
          dispatch(ShowLoading());
          const moviesResponse = await GetAllMovies();
          if (moviesResponse.success) {
            setMovies(moviesResponse.data);
          } else {
            message.error(moviesResponse.message);
          }
          const showsResponse = await GetAllShowsByTheatre({
            theatreId: theatre._id,
          });
          if (showsResponse.success) {
            setShows(showsResponse.data);
          } else {
            message.error(showsResponse.message);
          }
          dispatch(HideLoading());

        }catch (error) {
            message.error(error.message);
            dispatch(HideLoading());
            }
        };

        const handleAddShow = async (values) => {
            try {
              dispatch(ShowLoading());
              
              const response = await AddShow({
                ...values,
                
                theatre: theatre._id,
                
              });
              if (response.success) {
                message.success(response.message);
                getData();
                setView("table");
              } else {
                message.error(response.message);
              }
              dispatch(HideLoading());
            } catch (error) {
              message.error(error.message);
              dispatch(HideLoading());
            }
          };

          const handleDelete = async (id) => {
            try {
              dispatch(ShowLoading());
              const response = await DeleteShow({ showId: id });
        
              if (response.success) {
                message.success(response.message);
                getData();
              } else {
                message.error(response.message);
              }
              dispatch(HideLoading());
            } catch (error) {
              message.error(error.message);
              dispatch(HideLoading());
            }
          };
    
    const columns = [
        {
          title: "Show Name",
          dataIndex: "name",
        },
        {
          title: "Date",
          dataIndex: "date",
          render: (text, record) => {
            return moment(text).format("MMM Do YYYY");
          },
        },
        {
          title: "Time",
          dataIndex: "time",
        //    render: (text, record) => {
        //      return moment(text).format("HH:mm");
        //    }
         },
        {
          title: "Movie",
          dataIndex: "movie",
          render: (text, record) => {
            return record.movie.title;
          },
        },
        {
          title: "Ticket Price",
          dataIndex: "ticketPrice",
        },
        {
          title: "Total Seats",
          dataIndex: "totalSeats",
        },
        {
          title: "Available Seats",
          dataIndex: "availableSeats",
          render: (text, record) => {
            return record.totalSeats - record.bookedSeats.length;
          },
        },
        {
          title: "Action",
          dataIndex: "action",
          render: (text, record) => {
            return (
              <div className="flex gap-1 items-center">
                {record.bookedSeats.length === 0 && (
                  <i
                    className="ri-delete-bin-line"
                    onClick={() => {
                      handleDelete(record._id);
                    }}
                  ></i>
                )}
              </div>
            );
          },
         },
      ];

      useEffect(() => {
        getData();
      },[])
    

    return (
        <Modal
      title=""
      open={openShowsModal}
      onCancel={() => setOpenShowsModal(false)}
      width={1400}
      footer={null}
    >
      <h1 className="text-primary text-md uppercase mb-1">
        Theatre : {theatre.name}
      </h1>
      <hr />

      <div className="flex justify-between mt-1 mb-1 items-center">
        <h1 className="text-md uppercase">
          {view === "table" ? "Shows" : "Add Show"}
        </h1>
        {view === "table" && (
          <Button
            variant="outlined"
            title="Add Show"
            onClick={() => {
              setView("form");
            }}
          />
        )}
      </div>

      {view === "table" && <Table rowKey={record => record._id} columns={columns} dataSource={shows} />}

      {view === "form" && (
        <Form layout="vertical" onFinish={handleAddShow}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Show Name"
                name="name"
                rules={[{ required: true, message: "Please input show name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Space direction="horizontal"  style={{ width: '50%' }}>
            
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please input show date!" }]}
              >
               <DatePicker 
               
               disabledDate={d => !d || d.isBefore(Date())  }
               style={{ width: '300px' }}/> 
              
              </Form.Item>
            

            
              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: "Please input show time!" }]}
                
              >
             <TimePicker style={{ width: '330px' }} format={'HH:mm'}/>  
            
               </Form.Item>
            
            </Space>
            <Col span={8}>
              <Form.Item
                label="Movie"
                name="movie"
                rules={[{ required: true, message: "Please select movie!" }]}
              >
                <Select
                    placeholder="Select Movie"
                    options = { movies.map((movie) => ({label: movie.title, value: movie._id}))}
                />

                 
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ticket Price"
                name="ticketPrice"
                rules={[
                  { required: true, message: "Please input ticket price!" },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Total Seats"
                name="totalSeats"
                rules={[
                  { required: true, message: "Please input total seats!" },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-1">
            <Button
              variant="outlined"
              title="Cancel"
              onClick={() => {
                setView("table");
              }}
            />
            <Button variant="contained" title="SAVE" type="submit" />
          </div>
        </Form>
      )}

      </Modal>
    )

}

export default Shows;