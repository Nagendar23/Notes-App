import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal'; 
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import addNote from '../../assets/addNote.svg';
import noData from '../../assets/noData.svg';

Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setuserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const [lastSearchQuery, setLastSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({
      isShown:true,
      data:noteDetails,
      type:"edit",
    })
  }

  const showToastMessage = (message, type)=>{
    setShowToastMsg({
      isShown:true,
      message,
      type,
    });
  };

  const handleCloseToast = ()=>{
    setShowToastMsg({
      isShown:false,
      message:"",
    });
  }

  const[showToastMsg,setShowToastMsg] = useState({
    isShown:false,
    message:"",
    type:"add",

  });

  //get user info 
  const getUserInfo = async()=>{
    try{
      const response = await axiosInstance.get('/get-user');
      if(response.data && response.data.user){
        setuserInfo(response.data.user);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user)); 
      }
    }catch(error){
      if(error.response && error.response.status === 401){
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  //get all notes
  const fetchAllNotes = async()=>{
    try{
      const response = await axiosInstance.get('/get-all-notes');
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log("An unexpected error occured. Please try again later");
    }
  }

//Delete note
const deleteNote = async(data)=>{
  const noteId = data._id;
   try{
              const response = await axiosInstance.delete('/delete-note/'+noteId);
              if(response.data && !response.data.error){
                  showToastMessage('Note Deleted Successfully','delete')
                  fetchAllNotes()
              }
          }catch(error){
              if(error.response && error.response.data && error.response.data.message){
                console.log("An unexpected error occured. Please try again later");

              }
          }
}

//Search for a note
const onSearchNote = async (query) => {
    setLastSearchQuery(query);
    try {
        const response = await axiosInstance.get('/search-notes', {
            params: { query },
        });
        if (response.data && response.data.notes) {
            setIsSearch(true);
            setAllNotes(response.data.notes);
        }
    } catch (error) {
        console.log('Search Error',error);
    }
}

//update isPinned
const updateIsPinned = async (noteData) => {
  const noteId = noteData._id;
  try {
    const response = await axiosInstance.put('/update-note-pinned/' + noteId, {
      "isPinned": !noteData.isPinned
    });
    if (response.data && response.data.note) {
      showToastMessage(
        response.data.note.isPinned ? 'Note Pinned Successfully' : 'Note Unpinned Successfully'
      );
      if (isSearch && lastSearchQuery) {
        onSearchNote(lastSearchQuery);
      } else {
        fetchAllNotes();
        console.log(noteData);

      }
    }
  } catch (error) {
    console.log(error);
  }
};


const handleClearSearch = () => {
    setIsSearch(false);
    fetchAllNotes();
};  

  
  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user && user !== "undefined") {
      setuserInfo(JSON.parse(user));
    } else if (user === "undefined") {
      localStorage.removeItem('userInfo');
    }
    getUserInfo();
    fetchAllNotes();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
{ allNotes.length > 0 ?  (<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 px-4 mb-24'>
        {allNotes.map((item, index)=>(
          <NoteCard 
            key={item._id}
            title={item.title} 
            date={item.createdOn} // <-- pass the raw date
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updateIsPinned(item)}
          />
        ))}
      </div>) : (<EmptyCard 
      imgSrc={isSearch ? noData : addNote} message={isSearch 
      ? `Oops ! No notes found matching your search. ` 
      : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started! `}  />) }
      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10 z-50'
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          })
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal 
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ ...openAddEditModal, isShown: false })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll "
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={()=>{
            setOpenAddEditModal({isShown:false, type:"add", data:null})
          }}
          getAllNotes={fetchAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast 
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
