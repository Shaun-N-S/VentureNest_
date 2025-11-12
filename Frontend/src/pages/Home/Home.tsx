import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/bar/Navbar';
import type { Rootstate } from '../../store/store';
import { useIntrestedTopics } from '../../hooks/Auth/AuthHooks';
import toast from 'react-hot-toast';
import TopicSelectionModal from '../../components/modals/InterestedTopics';
import { useEffect, useState } from 'react';
import { updateUserData } from '../../store/Slice/authDataSlice';

const Home = () => {
  const userData = useSelector((state: Rootstate) => state.authData);

  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<string[]>([])
  const { mutate: setInterestedTopics } = useIntrestedTopics()
  const dispatch = useDispatch();
  console.log("userData from redux store", userData);

  useEffect(() => {
    if (userData.isFirstLogin) {
      console.log(userData.isFirstLogin)
      console.log("is first login", userData.isFirstLogin)
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [userData])

  const handleSave = (selected: string[]) => {
    setTopics(selected)
    console.log("User Selected Topics:", selected);
    setInterestedTopics({ id: userData.id, interestedTopics: selected }, {
      onSuccess: (res) => {
        console.log('response after setting intreested topics : ;  ', res);
        dispatch(updateUserData({ isFirstLogin: false }))

        toast.success('');
      },
      onError: (err) => {
        console.log(err);
      }
    })

  }

  return (
    <>
      <div className="p-6">
        <TopicSelectionModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSave}
          initialTopics={topics}
        />
      </div>
    </>
  );
};

export default Home;
