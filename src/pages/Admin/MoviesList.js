import MovieForm from "./MovieForm";
import {useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import {Table, message} from 'antd';
import { GetAllMovies, DeleteMovie } from "../../apicalls/movies";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import moment from 'moment';
import dayjs from "dayjs";

function MoviesList() {
    const [movies, setMovies] = useState([]);
    const [showMovieFormModal, setShowMovieFormModal] = useState(false);
    const [selectedMovie, setSelectedMovie] =useState(null);
    const [formType, setFormType] = useState("add");

    const dispatch = useDispatch();

    const getData = async () => {
      try {
        dispatch(ShowLoading());
        const response = await GetAllMovies();
        if (response.success) {
          console.log(response.data);
          setMovies(response.data);
        } else {
          message.error(response.message);
        }
        dispatch(HideLoading());
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    };
    const handleDelete = async (movieId) => {
      try {
        dispatch(ShowLoading());
        const response = await DeleteMovie({
          movieId,
        });
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
        title: "Poster",
        dataIndex: "poster",
        key:"poster",
        render: (text, record) => {
          return (
            <img
              src={record.poster}
              alt="poster"
              height="60"
              width="80"
              className="br-1"
            />
          );
        },
       
      },
      {
        title: "Name",
        dataIndex: "title",
        key: "title",
      },
  
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
      },
      {
        title: "Genre",
        dataIndex: "genre",
        key: "genre",
      },
      {
        title: "Language",
        dataIndex: "language",
        key: "language",
      },
      {
        title: "Release Date",
        dataIndex: "releaseDate",
        key: "releaseDate",
        render: (text, record) => {
          return dayjs(record.releaseDate).format("DD-MM-YYYY");
        },
       
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record) => {
          return (
            <div className="flex gap-1">
              <i
                className="ri-delete-bin-line"
                onClick={() => {
                  handleDelete(record._id);
                }}
              ></i>
              <i
                className="ri-pencil-line"
                onClick={() => {
                  record = {...record,
                            releaseDate: dayjs(record.releaseDate)}
                  console.log(record);          
                  setSelectedMovie(record);
                  setFormType("edit");
                  setShowMovieFormModal(true);
                }}
              ></i>
            </div>
          );
        },
      },
       
    
    ];
    useEffect(() => {
      getData();
    }, []);

    return (
    <div>
      <div className="flex justify-end mb-1">
        <Button
          title="Add Movie"
          variant="outlined"
          onClick={() => {
            setSelectedMovie(null);
            setShowMovieFormModal(true);
            setFormType("add");
          }}
        />
      </div>

      <Table rowKey={record => record._id} columns={columns} dataSource={movies} />

      {showMovieFormModal && (
        <MovieForm
          showMovieFormModal={showMovieFormModal}
          setShowMovieFormModal={setShowMovieFormModal}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}

      </div>
    )
}
export default MoviesList;