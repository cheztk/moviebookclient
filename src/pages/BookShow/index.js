import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { GetShowById } from "../../apicalls/theatres";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { message } from "antd";
import moment from "moment";

function BookShow() {

    const dispatch = useDispatch();
    const params = useParams();

    const [show,setShow] = useState(null);

    const getData = async () => {
        try {
          dispatch(ShowLoading());
          const response = await GetShowById({
            showId: params.id,
          });
          if (response.success) {
            setShow(response.data);
          } else {
            message.error(response.message);
          }
          dispatch(HideLoading());
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.message);
        }
      };

      useEffect(()=> {
        getData()
      },[params.id]);
    return (
        show && (
            <div>
              {/* show infomation */}
      
              <div className="flex justify-between card p-2 items-center">
                <div>
                  <h1 className="text-sm">{show.theatre.name}</h1>
                  <h1 className="text-sm">{show.theatre.address}</h1>
                </div>
      
                <div>
                  <h1 className="text-2xl uppercase">
                    {show.movie.title} ({show.movie.language})
                  </h1>
                </div>
      
                <div>
                  <h1 className="text-sm">
                    {moment(show.date).format("MMM Do yyyy")} -{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h1>
                </div>
              </div>



              </div>
        )
              
    )
}
export default BookShow;