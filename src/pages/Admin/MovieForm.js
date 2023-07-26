import {Modal, Form, Row, Col, Button, Input, InputNumber, Select, DatePicker, message} from 'antd';
import {HideLoading, ShowLoading} from '../../redux/loadersSlice';
import {useDispatch} from 'react-redux';
import { AddMovie, UpdateMovie } from '../../apicalls/movies';
import moment from 'moment';
import dayjs from 'dayjs';

function MovieForm({ 
    showMovieFormModal,
    setShowMovieFormModal,
    selectedMovie,
    setSelectedMovie,
    formType,
    getData
  }) {
    // if (selectedMovie) {
    //   selectedMovie.releaseDate = dayjs(selectedMovie.releaseDate).format(
    //     "YYYY-MM-DD"
    //   );
    // }
        const dispatch = useDispatch();
        const onFinish = async(values) => {
            try{
                dispatch(ShowLoading());
                let response = null;
                if(formType === "add"){
                    response = await AddMovie(values);
                } else {
                    response = await UpdateMovie({
                      ...values,
                      movieId: selectedMovie._id,
                    });
                  }
                  if (response.success) {
                    getData();
                    message.success(response.message);
                    setShowMovieFormModal(false);
                  } else {
                    message.error(response.message);
                  }
                  dispatch(HideLoading());
            
            }catch(err){
                dispatch(HideLoading());
                message.error(err.message);
            }
        }
    
    return (
    <Modal
        title={formType === "add" ? "ADD MOVIE" : "EDIT MOVIE"}
        open={showMovieFormModal}
        onCancel={() => {
            setShowMovieFormModal(false);
            setSelectedMovie(null);
        }}
        footer={null}
        width={800}
    > 
         <Form layout="vertical"  onFinish={onFinish} initialValues={selectedMovie}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Movie Name" name="title">
              <Input/>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Movie Description" name="description">
              <Input.TextArea/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Movie Duration (Min)" name="duration">
              <InputNumber/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Language" name="language">
              <Select name="" id="">
                <Select.Option value="">Select Language</Select.Option>
                <Select.Option value="Telugu">Telugu</Select.Option>
                <Select.Option value="English">English</Select.Option>
                <Select.Option value="Hindi">Hindi</Select.Option>
                <Select.Option value="Tamil">Tamil</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Movie Release Date" name="releaseDate">
              <DatePicker format={"YYYY-MM-DD"}/>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Genre" name="genre">
              <Select name="" id="">
                <Select.Option value="">Select Genre</Select.Option>
                <Select.Option value="Action">Action</Select.Option>
                <Select.Option value="Comedy">Comedy</Select.Option>
                <Select.Option value="Drama">Drama</Select.Option>
                <Select.Option value="Romance">Romance</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Poster URL" name="poster">
              <Input/>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-1">
          <Button
            
            variant="outlined"
            type="button"
            onClick={() => {
              setShowMovieFormModal(false);
              setSelectedMovie(null);
            }}
          >
            Cancel
            </Button>
            <Button type="primary"  htmlType="submit" >
                     Submit
            </Button>
        </div>
      </Form>
    </Modal>
    )
}
export default MovieForm;